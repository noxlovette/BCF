import type { BrowseComposite } from "$lib/types";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, params, locals }) => {
  // if (env.ALLOWED_USER !== locals.user.sub) {
  //   throw redirect(301, "/unauthorised");
  // }

  const { slug } = params;

  const endpoint = `/axum/browse/edit/${slug}`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch ingredient data from API");
  }
  const ingredientComposite: BrowseComposite = await response.json();

  return { ingredientComposite };
};

export const actions = {
  update: async ({ request, fetch, params }) => {
    const { slug } = params;
    const formData = await request.formData();
    let body = {
      commonName: formData.get("commonName"),
      cas: formData.get("cas"),
      ingDescription: formData.get("ingDescription"),
      otherNames: formData.get("otherNames"),
      volatility: formData.get("volatility"),
      restricted: formData.get("isRestricted") === "on",
    };

    console.log(formData.get("isRestricted"));

    const response = await fetch(`/axum/browse/edit/${slug}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return fail(500);
    }

    return redirect(301, ".");
  },
  approve: async ({ fetch, request }) => {
    const formData = await request.formData();
    const id = formData.get("id");

    let body = {
      status: "Approved",
    };

    fetch(`/axum/suggestion/s/${id}`,

      {
        method: "PATCH",
        body: JSON.stringify(body)
      }
    )
  },
  reject: async ({ fetch, request }) => {
    const formData = await request.formData();

    const id = formData.get("id");
    let body = {
      status: "Rejected",
    };

    fetch(`/axum/suggestion/s/${id}`,

      {
        method: "PATCH",
        body: JSON.stringify(body)
      }
    )
  }
} satisfies Actions;
