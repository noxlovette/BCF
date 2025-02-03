import type { Formula } from "$lib/types";
import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, params }) => {
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

export const actions = {
  update: async ({ request, fetch }) => {
    const formData = await request.formData();
    const id = formData.get("id");

    const fullData = formData.get("fullData");

    try {
      const _ = await fetch(`/axum/formulate/formula/${id}`, {
        method: "PATCH",
        body: fullData,
        credentials: "include",
      });
      return { success: true };
    } catch (err: any) {
      throw error(500, "Failed to edit the formula");
    }
  },
  delete: async ({ request, fetch }) => {
    const formData = await request.formData();
    const id = formData.get("id");

    const response = await fetch(`/axum/formulate/formula/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      redirect(301, "/formulate");
    } else {
      throw error(400, "Failed to delete the formula");
    }
  },
} satisfies Actions;
