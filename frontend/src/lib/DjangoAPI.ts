// src/routes/DjangoAPI.ts

let csrfToken: string | null = null;
const BASE_URL = "http://localhost:8000";


export async function fetchCSRFToken() {
  const response = await fetch(`${BASE_URL}/api/get-csrf/`, {
      method: 'GET',
      credentials: 'include'  // Necessary to include cookies if they are accessible
  });
  const data = await response.json();
  console.log(data.csrfToken);
  return data.csrfToken;  // Use this token for subsequent POST, PUT, DELETE requests
  
}


// Function to fetch data from Django API
export async function fetchDataFromDjango(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body: any = null,
  credentials: RequestCredentials = "include"  // Set to include to ensure cookies are sent
): Promise<any> {
  // Ensure CSRF token is set
  if (!csrfToken) {
    csrfToken = await fetchCSRFToken();
  }

  // Construct headers with CSRF token included
  const headers = {
    "Content-Type": "application/json",
    "X-CSRFToken": csrfToken,
  };

  // Make a request to Django API with CSRF token included in headers
  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
    credentials,
  };

  const response = await fetch(endpoint, options);

  if (!response.ok) {
    let errorText = await response.json();
    throw new Error(errorText.error);
  }

  // Only parse as JSON if the response has content
  if (response.status !== 204 && response.statusText !== "No Content") {
    const data = await response.json();
    return data;
  }
}

// Function to fetch ingredients data from Django API (browse)
export async function fetchIngredients(currentPage: number, searchTerm = "", pageSize = 10, chosenDescriptors = [], { forceReload = false } = {}) {
  const descriptors = chosenDescriptors.map(descriptor => `descriptors=${encodeURIComponent(descriptor.name)}`).join('&');

  console.log("Descriptors on the server:", descriptors);

  const cacheKey = `ingredients-${currentPage}-${searchTerm}-${pageSize}-${descriptors}`;
  let data = forceReload ? null : localStorage.getItem(cacheKey);
  if (data) {
    console.log("Data from cache:", data);
    if (!csrfToken) {
      csrfToken = await fetchCSRFToken();
    }
    return JSON.parse(data);
  } else {
    try {
      const endpoint = `${BASE_URL}/browse/api/ingredients?page=${currentPage}&search=${searchTerm}&page_size=${pageSize}&${descriptors}`;
      const ingredientsData = await fetchDataFromDjango(endpoint);
      console.log("Data from Django:", ingredientsData);
      localStorage.setItem(cacheKey, JSON.stringify(ingredientsData));
      return ingredientsData;
    } catch (error) {
      console.error("Error fetching data from Django:", error);
      return {
        error: "Failed to fetch ingredients data",
      };
    }
  }
  }

export async function addToCollection(ingredientId: number, userId: any) {
  try {
    const endpoint = `${BASE_URL}/collection/api/collection/${userId}/`;
    const body = { user_id: userId, ingredient_id: ingredientId };
    const response = await fetchDataFromDjango(endpoint, "POST", body);
    fetchCollection(userId, { forceReload: true });

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

export async function addSuggestion(body: any) {
  try {
    const endpoint = `${BASE_URL}/browse/api/suggestions/`;
    const response = await fetchDataFromDjango(endpoint, "POST", body);
    if (response.success) {
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

export async function fetchCollection(userId: any, { forceReload = false } = {}) {
  const cacheKey = `collection-${userId}`;
  let data = forceReload ? null : sessionStorage.getItem(cacheKey);
  if (data) {
    return JSON.parse(data);
  } else {
    try {
      const endpoint = `${BASE_URL}/collection/api/collection/${userId}/`;
      const data = await fetchDataFromDjango(endpoint);
      console.log("collection data from Django:", data);
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Error fetching data from Django:", error);
      return {
        error: "Failed to fetch collection data",
      };
    }
}
}

export async function deleteFromCollection(ingredient: any, userId: any) {
  try {
    let endpoint: string;
    if (ingredient.type === "CollectionIngredient") {
      endpoint = `${BASE_URL}/collection/api/ingredient/${userId}/${ingredient.id}/delete/`;
  } else if (ingredient.type === "CustomCollectionIngredient") {
      endpoint = `${BASE_URL}/collection/api/ingredient/${userId}/custom/${ingredient.id}/delete/`;
  }
    const response = await fetchDataFromDjango(endpoint, "DELETE");
    console.log("DELETE response from Django:", response);

    if (response === undefined || response.success) {
      return "Ingredient successfully removed from collection!";
    } else {
      console.error(response.error);
      return response.error;
    }
  } catch (error) {
    console.error("Error deleting ingredient from collection:", error);
    return error.message;
  }
}

export async function createCustomIngredient(body: any, userId: any) {
  try {
  const endpoint = `${BASE_URL}/collection/api/ingredient/${userId}/new/`;
    const response = await fetchDataFromDjango(endpoint, "POST", body);
    console.log("Custom ingredient creation response from Django:", response);
    fetchCollection(userId, { forceReload: true });
    return response;
  } catch (error) {
    console.error("Error creating custom ingredient:", error);
    return error.message;
  }
}

export async function logIn (body: any) {
  try {
    const endpoint = `${BASE_URL}/api/login/`;
    const response = await fetchDataFromDjango(endpoint, "POST", body);
    console.log("Login response from Django:", response);
    return response;
  } catch (error) {
    console.error("Error logging in:", error);
    return error.message;
  }
}

export async function logOut() {
  try {
    const endpoint = `${BASE_URL}/api/logout/`;
    const response = await fetchDataFromDjango(endpoint, "POST");
    console.log("Logout response from Django:", response);
    return response;
  } catch (error) {
    console.error("Error logging out:", error);
    return error.message;
  }
}

export async function signUp(body: any) {
  try {
    const endpoint = `${BASE_URL}/api/signup/`;
    const response = await fetchDataFromDjango(endpoint, "POST", body);
    console.log("Signup response from Django:", response);
    return response;
  } catch (error) {
    console.error("Error signing up:", error);
    return error.message;
  }
}

export async function saveEditedIngredient(ingredientToSave: any, userId: any) {
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
      endpoint = `${BASE_URL}/collection/api/ingredient/${userId}/${ingredientToSave.id}/update/`;
    } else if (ingredientToSave.type === "CustomCollectionIngredient") {
      endpoint = `${BASE_URL}/collection/api/ingredient/${userId}/custom/${ingredientToSave.id}/update/`;
    }

    // Make the PUT request to the Django API
    try {
      const response = await fetchDataFromDjango(endpoint, "PUT", data);
      console.log("Save edited ingredient response from Django:", response);
      return response;
    } catch (error) {
      console.error("Error saving edited ingredient:", error);
      return error.message;
    }
  }
  export async function listSuggestedIngredients(userId: any) {
    const url = `${BASE_URL}/browse/api/suggested-ingredients/${userId}/`;
    try {
        const data = await fetchDataFromDjango(url, "GET");
        console.log(data)
        return data
    } catch (error) {
        console.error("Failed to load ingredients");
        return error.message;
    }
}

export async function fetchDescriptors() {
  const url = `${BASE_URL}/browse/api/descriptors/`;
  const cacheKey = "descriptors";
  if (localStorage.getItem(cacheKey)) {
      console.log("Data from cache: " + localStorage.getItem(cacheKey));
      return JSON.parse(localStorage.getItem(cacheKey));
  } else {
  try {
      const response = await fetchDataFromDjango(url, "GET");
      console.log(response)
      localStorage.setItem(cacheKey, JSON.stringify(response));
      return response
  } catch (error) {
      console.error("Failed to load descriptors");
      return error.message;
  }
}
}

export async function addFormulaAsCustomIngredient(userId:any, formula:any) {
  console.log("Adding as custom");
  const data = {
    user: userId,
    common_name: formula.name,
    use: formula.description,
    formula: formula.id,
    cas: 'BASE',
    volatility: 'base',
    amount: 0,
    unit: 'g',
    ideas: '',
    impression: '',
    associations: '',
    colour: '',
  };
  let url = `${BASE_URL}/formulae/api/formula/${userId}/${formula.id}/add_as_custom/`;

  try {
    // Assuming fetchDataFromDjango is a function that handles the fetch API call
    let response = await fetchDataFromDjango(url, "POST", data);
    if (response.ok) {
      console.log("Server Response:", await response.json());
      return "Formula added as custom ingredient";
    } else {
      // Parse the JSON response body to get the error message
      const errorData = await response.json();
      throw new Error(errorData.detail || "Unknown error occurred");
    }
  } catch (error) {
    console.error("Error fetching data from Django:", error);
    return `error. you might already have this formula in your collection`;
  }
}

export async function saveChangesFormula (userId, formData, editedFormulaId) {
  let url = `${BASE_URL}/formulae/api/formula/${userId}/${editedFormulaId}/`;
  let data = await fetchDataFromDjango(url, "PUT", formData);
  const cacheKey = `formula-${userId}-${editedFormulaId}`;
  sessionStorage.setItem(cacheKey, JSON.stringify(data));
  fetchFormulaeApi(userId, { forceReload: true });
  return data;
}

export async function createFormulaAPI (userId) {
  const formData = {
    name: "New Formula",
    description: "Write something inspiring here!",
    notes: "Add some notes here...",
    ingredients: [],
    user: userId,
  };
  let url = `${BASE_URL}/formulae/api/formula/${userId}/new/`;
  let data = await fetchDataFromDjango(url, "POST", formData);
  return data;
}

export async function deleteFormulaAPI (userId, formulaId) {
  let url = `${BASE_URL}/formulae/api/formula/${userId}/${formulaId}/delete/`;
  let data = await fetchDataFromDjango(url, "DELETE");
  return data;
}

export async function deleteIngredientApi (userId, ingredientId) {
  let url = `${BASE_URL}/formulae/api/ingredient/${userId}/${ingredientId}/delete/`;
  let data = await fetchDataFromDjango(url, "DELETE");
  return data;
}

export async function fetchFormulaeApi(userId, {forceReload = false} = {}) {
  const cacheKey = `formulae-${userId}`;
  let data = forceReload ? null : sessionStorage.getItem(cacheKey);
  if (data) {
    console.log("formulae from cache:", data);
    return JSON.parse(data);
  } else {
    try {
      console.log("Fetching formulae");
      const endpoint = `${BASE_URL}/formulae/api/formula/${userId}/list/`;
      const data = await fetchDataFromDjango(endpoint);
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching data from Django:", error);
      return {
        error: "Failed to fetch formulae data",
      };
    
  }
}
}

export async function fetchFormulaApi(userId, formulaId, {forceReload = false} = {}) {
  const cacheKey = `formula-${userId}-${formulaId}`;
  let data = forceReload ? null : sessionStorage.getItem(cacheKey);
  if (data) {
    console.log("formula from cache:", data);
    return JSON.parse(data);
  } else {
    try {
      console.log("Fetching formula");
      const endpoint = `${BASE_URL}/formulae/api/formula/${userId}/${formulaId}/`;
      const data = await fetchDataFromDjango(endpoint);
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching data from Django:", error);
      return {
        error: "Failed to fetch formula data",
      };
  }
  }
}
