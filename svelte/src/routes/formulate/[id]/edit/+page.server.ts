import { error, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
  update: async ({ request, fetch }) => {
    const formData = await request.formData();
    const id = formData.get("id");
    const title = formData.get("title");
    const description = formData.get("description");
    const solvent = formData.get("solvent");
    const ingredients = formData
      .getAll("ingredient")
      .map((ing) => JSON.parse(ing));

    const body = {
      title,
      description,
      solvent,
      ingredients,
    };

    console.debug(body);
    const response = await fetch(`/axum/formulate/formula/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    if (response.ok) {
      return redirect(301, ".");
    } else {
      return error(400);
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
