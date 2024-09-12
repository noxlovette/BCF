import redis from "$lib/redisClient";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, url }) => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  try {
    const cacheKeyIngredients = `browse-total`;

    let ingredients: App.ResponseBrowse;

    const cachedIngredients = await redis.get(cacheKeyIngredients);
    if (cachedIngredients) {
      ingredients = await JSON.parse(cachedIngredients);
    } else {
      const response = await fetch(
        `${VITE_API_URL}/browse/api/ingredients-total/`,
      );
      ingredients = await response.json();

      await redis.set(
        cacheKeyIngredients,
        JSON.stringify(ingredients),
        "EX",
        21600,
      );
    }

    return { ingredients };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      error: "Failed to fetch ingredients data",
    };
  }
};
