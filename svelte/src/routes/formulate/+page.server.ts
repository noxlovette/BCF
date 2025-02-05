import type { Formula } from "$lib/types";
import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, cookies }) => {
  try {
    const endpoint = `/axum/formulate`;

    const response = await fetch(endpoint, {
      method: "GET",
    });

    if (!response.ok) {
      return error(response.status, "Failed to fetch formulae data");
    }
    const formulas: Formula[] = await response.json();

    return { formulas };
  } catch (error) {
    return error(error.status, error.body);
  }
};

export const actions = {
  create: async ({ fetch }) => {
    const body = {
      title: "New Formula",
      description: "Express yourself",
    };

    const response = await fetch(`/axum/formulate`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const formula = await response.json();
      redirect(301, `/formulate/${formula.id}/edit`);
    } else {
      return error(500);
    }
  },
} satisfies Actions;
