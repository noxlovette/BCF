import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import type { IngredientCollection } from "$lib/types";


export const load: PageServerLoad = async ({ fetch, url }) => {
  let page = url.searchParams.get("page") || "1";
  let pageSize = url.searchParams.get("page_size") || "10";
  const search = url.searchParams.get("search") || "";
  if (Number(page) < 1) {
    page = "1"
  }
  if (Number(pageSize) < 1) {
    pageSize = "10"
  }
  try {
    const endpoint = `/axum/collect?page=${page}&search=${search}&page_size=${pageSize}`;
    const response = await fetch(endpoint, {
      method: "GET",
    });

    let collection: IngredientCollection[] = await response.json();
    return {
      collection,
    };
  } catch (error) {
    return error(500, "Failed to Fetch Collection");
  }
};

export const actions = {
  create: async ({ fetch }) => {

    const response = await fetch(
      `/axum/collect`,
      {
        method: "POST",
      },
    );

    if (response.ok) {
      const newIngredient = await response.json();
      redirect(301, `/collect/${newIngredient.id}`);
    } else {

      return error(500);
    }
  }
} satisfies Actions;
