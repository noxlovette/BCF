import redis from "$lib/redisClient";
import getUnsplashURL from "$lib/unsplash";
import { error } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, params, depends }) => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const { slug } = params;

  depends("browse:related");
  try {
    let ingredient: App.IngredientBrowse | null = null;
    let cachedIngredient = await redis.get(slug);
    let photo = null;

    if (cachedIngredient !== null) {
      ingredient = JSON.parse(cachedIngredient);
    } else {
      const endpoint = `${VITE_API_URL}/browse/api/ingredients/${slug}/`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Failed to fetch ingredient data from API");
      }
      ingredient = await response.json();
      await redis.set(slug, JSON.stringify(ingredient), "EX", 3600);
    }

    const query = ingredient.descriptors;
    let cachedPhoto = await redis.get(`${query}-photo`);

    if (cachedPhoto !== null) {
      photo = JSON.parse(cachedPhoto);
    } else {
      const unsplashURL = getUnsplashURL(query);
      const unsplashResponse = await fetch(unsplashURL);
      if (!unsplashResponse.ok) {
        throw new Error("Failed to fetch photo from Unsplash");
      }
      photo = await unsplashResponse.json();
      await redis.set(`${query}-photo`, JSON.stringify(photo), "EX", 3600);
    }

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
      const response = await fetch(
        `${VITE_API_URL}/collection/new/api/collection/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
            Cookie: `sessionid=${sessionid}; csrftoken=${csrfToken}`,
          },
          body: JSON.stringify({ ingredient_id: ingredientId }),
          credentials: "include",
        },
      );

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
      message: formData.get("message"), // Assuming you have a field named 'message' in your form
      ingredient: formData.get("ingredient"),
      common_name: formData.get("common_name"),
      other_names: formData.get("other_names"),
      volatility: formData.get("volatility"),
      use: formData.get("use"),
      origin: formData.get("origin"),
      related_ingredients: formData.get("related_ingredients")
        ? JSON.stringify(formData.get("related_ingredients"))
        : null,
      is_restricted: formData.get("is_restricted"),
    };

    if (!sessionid) {
      throw error(401, "Unauthorized");
    }

    try {
      const response = await fetch(
        `${VITE_API_URL}/browse/api/suggested-ingredients/new/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
            Cookie: `sessionid=${sessionid}; csrftoken=${csrfToken}`,
          },
          body: JSON.stringify(body),
          credentials: "include",
        },
      );

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: response.error || "An error occurred" };
      }
    } catch (err: any) {
      throw error(500, "Failed to suggest a change");
    }
  },
} satisfies Actions;
