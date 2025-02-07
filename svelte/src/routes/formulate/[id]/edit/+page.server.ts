import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
  update: async ({ request, fetch }) => {
    const formData = await request.formData();
    const id = formData.get("id");
    const title = formData.get("title");
    const description = formData.get("description");
    const solvent = formData.get("solvent");
    const ingredients = formData.getAll("ingredient").map((ing) => {
      if (typeof ing === "string") {
        return JSON.parse(ing);
      } else {
        return fail(400, {
          message: "Invalid ingredient format",
        });
      }
    });

    const formula = {
      title,
      description,
      solvent,
    };

    const body = {
      formula,
      ingredients,
    };

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
