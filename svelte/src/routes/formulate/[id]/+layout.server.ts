import type { Formula } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ fetch, params }) => {
  try {
    const { id } = params;
    const endpoint = `/axum/formulate/formula/${id}`;

    const response = await fetch(endpoint, {
      method: "GET",
    });

    if (!response.ok) {
      return error(response.status, "Failed to fetch formula data");
    }

    const formula: Formula = await response.json();
    return { formula };
  } catch (err: any) {
    return error(500, "Internal Server Error");
  }
};
