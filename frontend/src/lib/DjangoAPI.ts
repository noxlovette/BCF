// src/routes/DjangoAPI
import { get, writable } from "svelte/store";

const BASE_URL = import.meta.env.VITE_API_URL || "https://api.bcfapp.app";
const csrfToken = writable("");

export async function fetchCSRFToken(forceFetch = false) {
  const currentToken = get(csrfToken);
  if (!currentToken || forceFetch) {
    // Fetch a new CSRF token if none exists or if forceFetch is true
    const response = await fetch(`${BASE_URL}/api/get-csrf/`, {
      method: "GET",
      credentials: "include", // Necessary to include cookies if they are accessible
    });
    const data = await response.json();
    csrfToken.set(data.csrfToken);
  }
}

// the central bridge to the backend
export async function fetchCentralDjangoApi(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body: any = null,
  credentials: RequestCredentials = "include", // Ensures cookies are sent
): Promise<any> {
  await fetchCSRFToken(); // Ensure CSRF token is fetched and set before making the API call
  const token = get(csrfToken); // Use the get function to access the value of the csrfToken store

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-CSRFToken": token,
  };

  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
    credentials,
  };

  const response = await fetch(endpoint, options);

  if (!response.ok) {
    const errorText = await response.json();
    throw new Error(errorText.error || "Unknown error");
  } else if (response.status === 204) {
    return response;
  } else {
    return response.json();
  }
}

// BROWSE PAGE
export async function fetchIngredientsBrowse(
  currentPage: number,
  searchTerm = "",
  pageSize = 10,
  chosenDescriptors = [],
  { forceReload = false } = {},
) {
  const descriptors = chosenDescriptors
    .map((descriptor) => `descriptors=${encodeURIComponent(descriptor.name)}`)
    .join("&");

  const cacheKey = `ingredients-${currentPage}-${searchTerm}-${pageSize}-${descriptors}`;
  let data = forceReload ? null : sessionStorage.getItem(cacheKey);
  if (data) {
    return JSON.parse(data);
  } else {
    try {
      const endpoint = `${BASE_URL}/browse/api/ingredients?page=${currentPage}&search=${searchTerm}&page_size=${pageSize}&${descriptors}`;
      const ingredientsData = await fetchCentralDjangoApi(endpoint);

      sessionStorage.setItem(cacheKey, JSON.stringify(ingredientsData));
      return ingredientsData;
    } catch (error) {
      console.error("Error fetching data from Django:", error);
      return {
        error: "Failed to fetch ingredients data",
      };
    }
  }
}

export async function addToCollectionBrowse(ingredientId: number) {
  try {
    const endpoint = `${BASE_URL}/collection/api/collection/`;
    const body = { ingredient_id: ingredientId };
    const response = await fetchCentralDjangoApi(endpoint, "POST", body);
    fetchCollection({ forceReload: true });

    if (response.success) {
      return "ingredient successfully added to collection!";
    } else {
      console.error(response.error);
      // If the Django API returns an error message, it will be in response.error
      return response.error;
    }
  } catch (error) {
    console.error("Error adding ingredient to collection:", error);
    // If the error is an instance of Error, the message will be in error.message
    return error.message;
  }
}

export async function addSuggestionBrowse(body: any) {
  try {
    const endpoint = `${BASE_URL}/browse/api/suggested-ingredients/new/`;
    const response = await fetchCentralDjangoApi(endpoint, "POST", body);

    if (response.id || response.success === true || response === "") {
      listSuggestedIngredients({ forceReload: true });
      return "Suggestion successfully added!";
    } else {
      console.error(response.error);
      return response.error;
    }
  } catch (error) {
    console.error("Error adding suggestion:", error);
    return error.message;
  }
}

// COLLECT PAGE

export async function fetchCollection({ forceReload = false } = {}) {
  const cacheKey = `collection`;
  let data = forceReload ? null : sessionStorage.getItem(cacheKey);
  if (data) {
    return JSON.parse(data);
  } else {
    try {
      const endpoint = `${BASE_URL}/collection/api/collection/`;
      const data = await fetchCentralDjangoApi(endpoint);

      if (
        Array.isArray(data) &&
        data.length > 0 &&
        data[0].hasOwnProperty("common_name")
      ) {
        const sortedData = data.sort((a, b) => {
          // Handle null or undefined common_name values by replacing them with an empty string
          const nameA = a.common_name || "";
          const nameB = b.common_name || "";

          return nameA.localeCompare(nameB);
        });

        sessionStorage.setItem(cacheKey, JSON.stringify(sortedData));
        return sortedData;
      } else {
        console.error(
          'Data is not in expected array format or missing "name" property:',
          data,
        );
        return data; // return data as is if not sortable
      }
    } catch (error) {
      console.error("Error fetching data from Django:", error);
      return {
        error: "Failed to fetch collection data",
      };
    }
  }
}

export async function deleteFromCollection(ingredient: any) {
  try {
    let endpoint: string;
    if (ingredient.type === "CollectionIngredient") {
      endpoint = `${BASE_URL}/collection/api/ingredient/${ingredient.id}/delete/`;
    } else if (ingredient.type === "CustomCollectionIngredient") {
      endpoint = `${BASE_URL}/collection/api/ingredient/custom/${ingredient.id}/delete/`;
    }
    await fetchCentralDjangoApi(endpoint, "DELETE");
    fetchCollection({ forceReload: true });
    return "Ingredient successfully removed from collection!";
  } catch (error) {
    console.error("Error deleting ingredient from collection API:", error);
    throw error;
  }
}

export async function createCustomIngredientCollect(body: any) {
  try {
    const endpoint = `${BASE_URL}/collection/api/ingredient/new/`;
    const response = await fetchCentralDjangoApi(endpoint, "POST", body);

    fetchCollection({ forceReload: true });
    return response;
  } catch (error) {
    console.error("Error creating custom ingredient:", error);
    return error.message;
  }
}

export async function saveEditedIngredientCollect(ingredientToSave: any) {
  // Collect the data from the input fields
  const data = {
    common_name: ingredientToSave.common_name,
    cas: ingredientToSave.cas,
    volatility: ingredientToSave.volatility,
    use: ingredientToSave.use,
    colour: ingredientToSave.colour,
    impression: ingredientToSave.impression,
    ideas: ingredientToSave.ideas,
    associations: ingredientToSave.associations,
    amount: ingredientToSave.amount,
    unit: ingredientToSave.unit,
  };

  // Define the URL for the PUT request
  let endpoint: string;
  if (ingredientToSave.type === "CollectionIngredient") {
    endpoint = `${BASE_URL}/collection/api/ingredient/${ingredientToSave.id}/update/`;
  } else if (ingredientToSave.type === "CustomCollectionIngredient") {
    endpoint = `${BASE_URL}/collection/api/ingredient/custom/${ingredientToSave.id}/update/`;
  }

  // Make the PUT request to the Django API
  try {
    const response = await fetchCentralDjangoApi(endpoint, "PUT", data);

    return response;
  } catch (error) {
    console.error("Error saving edited ingredient:", error);
    return error.message;
  }
}

// FORMULATE PAGE

export async function addFormulaAsCustomIngredient(formula: any) {
  const data = {
    common_name: formula.name,
    use: formula.description,
    formula_id: formula.id,
    cas: "BASE",
    volatility: "base",
    amount: 0,
    unit: "g",
    ideas: "",
    impression: "",
    associations: "",
    colour: "",
  };
  let url = `${BASE_URL}/formulae/api/formula/${formula.id}/add_as_custom/`;

  // Assuming fetchCentralDjangoApi is a function that wraps fetch and handles the response
  let response = await fetchCentralDjangoApi(url, "POST", data);

  if (response.id) {
    // Check if 'id' is present in the response
    fetchCollection({ forceReload: true }); // Force reload if needed
    return "Formula added as custom ingredient";
  } else {
    return "error occured. you might have already added this formula as custom ingredient.";
  }
}

export async function saveChangesFormula(formData, editedFormulaId) {
  let url = `${BASE_URL}/formulae/api/formula/${editedFormulaId}/`;
  let data = await fetchCentralDjangoApi(url, "PUT", formData);
  const cacheKey = `formula-${editedFormulaId}`;
  sessionStorage.setItem(cacheKey, JSON.stringify(data));
  return data;
}

export async function createFormula() {
  const formData = {
    name: "New Formula",
    description: "Write something inspiring here!",
    notes: "Add some notes here...",
    solvent: "Ethanol",
    ingredients: [],
  };
  let url = `${BASE_URL}/formulae/api/formula/new/`;
  let data = await fetchCentralDjangoApi(url, "POST", formData);
  return data;
}

export async function deleteFormula(formulaId) {
  let url = `${BASE_URL}/formulae/api/formula/${formulaId}/delete/`;
  let data = await fetchCentralDjangoApi(url, "DELETE");
  fetchFormulas({ forceReload: true });
  return data;
}

export async function deleteIngredientFormulate(ingredientId) {
  let url = `${BASE_URL}/formulae/api/ingredient/${ingredientId}/delete/`;
  let data = await fetchCentralDjangoApi(url, "DELETE");
  return data;
}

export async function fetchFormulas({ forceReload = false } = {}) {
  const cacheKey = `formulae`;
  let data = forceReload ? null : sessionStorage.getItem(cacheKey);
  if (data) {
    return JSON.parse(data);
  } else {
    try {
      const endpoint = `${BASE_URL}/formulae/api/formula/list/`;
      const data = await fetchCentralDjangoApi(endpoint);
      sessionStorage.setItem(cacheKey, JSON.stringify(data));

      return data;
    } catch (error) {
      console.error("Error fetching data from Django:", error);
      return {
        error: "Failed to fetch formulae data",
      };
    }
  }
}

export async function fetchFormula(formulaId, { forceReload = false } = {}) {
  const cacheKey = `formula-${formulaId}`;
  let data = forceReload ? null : sessionStorage.getItem(cacheKey);
  if (data) {
    return JSON.parse(data);
  } else {
    try {
      const endpoint = `${BASE_URL}/formulae/api/formula/${formulaId}/`;
      const data = await fetchCentralDjangoApi(endpoint);
      sessionStorage.setItem(cacheKey, JSON.stringify(data));

      return data;
    } catch (error) {
      console.error("Error fetching data from Django:", error);
      return {
        error: "Failed to fetch formula data",
      };
    }
  }
}

// USER PAGES
export async function logOut() {
  try {
    const endpoint = `${BASE_URL}/api/logout/`;
    const response = await fetchCentralDjangoApi(endpoint, "POST");

    sessionStorage.clear();
    csrfToken.set("");
    return response;
  } catch (error) {
    console.error("Error logging out:", error);
    throw new error.message();
  }
}
export async function logIn(body) {
  const endpoint = `${BASE_URL}/api/login/`;
  try {
    const response = await fetchCentralDjangoApi(endpoint, "POST", body);

    await fetchCSRFToken(true); // Fetch a new CSRF token after logging in

    return response; // This will be your user data on successful login
  } catch (error) {
    console.error("Error logging in:", error);
    return { error: error.message }; // Structure the error in a consistent format
  }
}

export async function signUp(body: any) {
  const endpoint = `${BASE_URL}/api/signup/`;
  try {
    const response = await fetchCentralDjangoApi(endpoint, "POST", body);
    await fetchCSRFToken(true); // Fetch a new CSRF token after signing up
    return response;
  } catch (error) {
    console.error("Error signing up:", error);
    return { error: error.message }; // Structure the error in a consistent format
  }
}

export async function deleteUserProfile() {
  const endpoint = `${BASE_URL}/api/profile/delete/`;
  try {
    const response = await fetchCentralDjangoApi(endpoint, "DELETE");
    logOut();

    return response;
  } catch (error) {
    console.error("Error deleting profile:", error);
    throw error;
  }
}

export async function updateUserProfile(body: string) {
  const endpoint = `${BASE_URL}/api/profile/update/`;

  try {
    const response = await fetchCentralDjangoApi(endpoint, "PUT", body);

    return response;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}
export async function listSuggestedIngredients({ forceReload = false } = {}) {
  const cacheKey = `suggested-ingredients`;
  const url = `${BASE_URL}/browse/api/suggested-ingredients/`;

  if (!forceReload) {
    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  }

  try {
    const data = await fetchCentralDjangoApi(url, "GET");
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Failed to load ingredients: ", error.message);
    // Consider whether to return an error object or throw it
    throw new Error(error.message); // Throwing allows the caller to handle errors more flexibly.
  }
}

export async function fetchDescriptors() {
  const url = `${BASE_URL}/browse/api/descriptors/`;
  const cacheKey = "descriptors";
  if (localStorage.getItem(cacheKey)) {
    return JSON.parse(localStorage.getItem(cacheKey));
  } else {
    try {
      const response = await fetchCentralDjangoApi(url, "GET");
      console.log(response);
      localStorage.setItem(cacheKey, JSON.stringify(response));
      return response;
    } catch (error) {
      console.error("Failed to load descriptors");
      throw error;
    }
  }
}
