import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import type { IngredientCollection } from "$lib/types";


export const load: PageServerLoad = async ({ fetch }) => {
  try {

    const endpoint = `/axum/collect`;

    const response = await fetch(endpoint, {
      method: "GET",
    });

    if (!response.ok) {
      throw error(response.status, "Failed to fetch collection data");
    }

    const data: IngredientCollection[] = await response.json();

    return {
      collection: data,
    };
  } catch (err: any) {
    if (err.status) {
      throw error(err.status, err.body);
    }
    throw error(500, "Internal Server Error");
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
