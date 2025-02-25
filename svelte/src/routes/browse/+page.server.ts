import type { IngredientBrowse } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, url }) => {
  let page = url.searchParams.get("page") || "1";
  let pageSize = url.searchParams.get("page_size") || "10";
  const search = url.searchParams.get("search") || "";

  if (Number(page) < 1) {
    page = "1";
  }

  if (Number(pageSize) < 1) {
    pageSize = "10";
  }

  try {
    const response = await fetch(
      `/axum/browse?page=${page}&search=${search}&page_size=${pageSize}`,
    );

    let ingredients: IngredientBrowse[] = await response.json();

    return {
      ingredients,
    };
  } catch (error) {
    return {
      error: "Failed to fetch ingredients data",
    };
  }
};
