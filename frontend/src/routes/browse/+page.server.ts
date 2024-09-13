import redis from "$lib/redisClient";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, url }) => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const page = url.searchParams.get("page") || "1";
  const search = url.searchParams.get("search") || "";
  const pageSize = url.searchParams.get("page_size") || "100";

  try {
    const cacheKeyIngredients = `browse-${page}-${search}-${pageSize}`;
    let ingredients: App.ResponseBrowse;

    const cachedIngredients = await redis.get(cacheKeyIngredients);
    if (cachedIngredients) {
      ingredients = await JSON.parse(cachedIngredients);
    } else {
      const response = await fetch(
        `${VITE_API_URL}/browse/api/ingredients?page=${page}&search=${search}&page_size=${pageSize}`,
      );
      ingredients = await response.json();

      await redis.set(
        cacheKeyIngredients,
        JSON.stringify(ingredients),
        "EX",
        7200,
      );
    }

    return {
      ingredients,
      urlParams: {
        page,
        search,
        pageSize,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      error: "Failed to fetch ingredients data",
    };
  }
};
