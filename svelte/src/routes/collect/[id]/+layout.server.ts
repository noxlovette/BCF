import { parseMarkdown } from "$lib/server";
import type { IngredientCollection } from "$lib/types";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ fetch, params }) => {
  const { id } = params;
  try {
    const endpoint = `/axum/collect/ci/${id}`;

    const response = await fetch(endpoint, {
      method: "GET",
    });
    const ingredient: IngredientCollection = await response.json();
    let markdown = "You haven't made any notes yet";
    if (ingredient.markdown) {
      markdown = await parseMarkdown(ingredient.markdown);
    }

    return {
      ingredient,
      markdown,
    };
  } catch (error) {
    return {
      error: "Failed to fetch browse data",
    };
  }
};
