import { error, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
  update: async ({ request, fetch, params }) => {
    const formData = await request.formData();
    const id = params.id;

    let body = {
      commonName: formData.get("commonName"),
      cas: formData.get("cas"),
      otherNames: formData.get("otherNames"),
      markdown: formData.get("markdown"),
      amount: Number(formData.get("amount")),
    };

    const response = await fetch(`/axum/collect/ci/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });

    if (response.ok) {
      redirect(301, `/collect/${id}`);
    } else {
      const error = await response.json();
      return error(500, { message: error });
    }
  },
  delete: async ({ fetch, request, params }) => {
    const formData = await request.formData();
    const id = params.id;

    const response = await fetch(`/axum/collect/ci/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      redirect(301, "/collect");
    } else {
      return error(400, "Failed to delete the ingredient");
    }
  },
} satisfies Actions;
