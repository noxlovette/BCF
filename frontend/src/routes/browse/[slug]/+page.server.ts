import redis from "$lib/redisClient";
import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";
import { error } from "@sveltejs/kit";
import getUnsplashURL from "$lib/unsplash";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const { slug } = params;

  try {
    // Check if the ingredient is in the Redis cache
    let ingredient: App.IngredientBrowse | null = null;
    let cachedIngredient = await redis.get(slug);
    let photo = null;

    if (cachedIngredient !== null) {
      // If the ingredient is cached, parse it
      ingredient = JSON.parse(cachedIngredient);
    } else {
      // If the ingredient is not cached, fetch it from the API
      const endpoint = `${VITE_API_URL}/browse/api/ingredients/${slug}/`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Failed to fetch ingredient data from API");
      }
      ingredient = await response.json();
      // Cache the fetched ingredient data in Redis
      await redis.set(slug, JSON.stringify(ingredient), "EX", 3600);
    }

    // Extract the query from the ingredient to use for the Unsplash API
    const query = ingredient.descriptors;

    // Check if the Unsplash photo is in the Redis cache
    let cachedPhoto = await redis.get(`${query}-photo`);

    if (cachedPhoto !== null) {
      // If the photo is cached, parse it
      photo = JSON.parse(cachedPhoto);
    } else {
      // If the photo is not cached, fetch it from the Unsplash API
      const unsplashURL = getUnsplashURL(query);
      console.log("Unsplash URL:", unsplashURL);

      const unsplashResponse = await fetch(unsplashURL);

      // Check if the Unsplash response is OK (status 200)
      if (!unsplashResponse.ok) {
        throw new Error("Failed to fetch photo from Unsplash");
      }

      // Extract JSON data from the Unsplash response
      photo = await unsplashResponse.json();
      console.log("Unsplash response data:", photo);

      // Cache the fetched Unsplash photo data in Redis
      await redis.set(`${query}-photo`, JSON.stringify(photo), "EX", 3600);
    }

    // Return both the ingredient and photo data
    return { ingredient, photo };
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
      const response = await fetch(`${VITE_API_URL}/collection/new/api/collection/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
          Cookie: `sessionid=${sessionid}; csrftoken=${csrfToken}`,
        },
        body: JSON.stringify({ ingredient_id: ingredientId }),
        credentials: 'include',
      });

  
      if (response.ok) {
        const cacheKey = `collection-${sessionid}`;
        const value = await redis.get(cacheKey);
        if (value !== null) {
          await redis.del(cacheKey);
        }

        return { success: true };
      } else {
        return { success: false, error: response.error || "An error occurred" };
      }

    } catch (err: any) {
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