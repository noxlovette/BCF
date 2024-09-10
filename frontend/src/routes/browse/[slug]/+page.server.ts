import redis from "$lib/redisClient";
import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const { slug } = params;
  try {
    let value = await redis.get(slug);
    if (value !== null) {
      return {
        ingredient: JSON.parse(value),
      };
    }
    const endpoint = `${VITE_API_URL}/browse/api/ingredients/${slug}/`;

    const response = await fetch(endpoint);
    const ingredient = await response.json();
    await redis.set(slug, JSON.stringify(ingredient), "EX", 3600);
    return { ingredient };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      error: "Failed to fetch browse data",
    };
  }
};

export const actions = {
  add: async ({ cookies, request }) => {
    const VITE_API_URL = import.meta.env.VITE_API_URL;
    const sessionid = cookies.get("sessionid");
    const csrfToken = cookies.get("csrftoken");
    const data = await request.formData();
    const ingredientId = data.get("id");

    if (!sessionid) {
      throw error(401, "Unauthorized");
    }

    try {
      const response = await fetch(`${VITE_API_URL}/collection/api/collection/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
          Cookie: `sessionid=${sessionid}; csrftoken=${csrfToken}`,
        },
        body: JSON.stringify({ ingredient_id: ingredientId }),
        credentials: 'include',
      });

      console.log("Response:", response);
  
      if (response.ok) {
        console.log("Successfully added ingredient to collection");
        return { success: true };
      } else {
        console.log("Failed");
        return { success: false, error: response.error || "An error occurred" };
      }

    } catch (err: any) {
      console.error("Error in add action:", err);
      throw error(500, "Failed to add ingredient to collection");
    }
  },
  suggest: async ({ cookies, request }) => {
    const VITE_API_URL = import.meta.env.VITE_API_URL;
    const sessionid = cookies.get("sessionid");
    const csrfToken = cookies.get("csrftoken");
    const formData = await request.formData();

    let body = {
      message: formData.get('message'), // Assuming you have a field named 'message' in your form
      ingredient: formData.get('ingredient'),
      common_name: formData.get('common_name'),
      other_names: formData.get('other_names'),
      volatility: formData.get('volatility'),
      use: formData.get('use'),
      origin: formData.get('origin'),
      similar_ingredients: formData.get('similar_ingredients') 
        ? JSON.stringify(formData.get('similar_ingredients'))
        : null,
      is_restricted: formData.get('is_restricted'),
    };

    if (!sessionid) {
      throw error(401, "Unauthorized");
    }

    try {
      const response = await fetch(`${VITE_API_URL}/browse/api/suggested-ingredients/new/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
          Cookie: `sessionid=${sessionid}; csrftoken=${csrfToken}`,
        },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      console.log("Response:", response);
  
      if (response.ok) {
        console.log("Successfully suggested a change");
        return { success: true };
      } else {
        console.log("Failed");
        return { success: false, error: response.error || "An error occurred" };
      }

    } catch (err: any) {
      console.error("Error in add action:", err);
      throw error(500, "Failed to suggest a change");
    }
  }
  
} satisfies Actions;