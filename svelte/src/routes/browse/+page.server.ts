import redis from "$lib/redisClient";
import type { PageServerLoad } from "./$types";
import type { IngredientBrowse } from "$lib/types";

export const load: PageServerLoad = async ({ fetch, url }) => {
  const page = url.searchParams.get("page") || "1";
  const search = url.searchParams.get("search") || "";
  const pageSize = url.searchParams.get("page_size") || "10";

  try {
    const response = await fetch(
      `/axum/browse?page=${page}&search=${search}&page_size=${pageSize}`,
    );

    console.log("response from the servter ts", response)
    let ingredients: IngredientBrowse[] = await response.json();

    console.log(ingredients.length)
    return {
      ingredients
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      error: "Failed to fetch ingredients data",
    };
  }
};
