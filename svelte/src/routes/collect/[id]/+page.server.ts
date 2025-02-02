import redis from "$lib/redisClient";
import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({
  fetch,
  params,
}) => {
  const { id } = params;
  try {

    const endpoint = `/axum/collect/ci/${id}`;

    const response = await fetch(endpoint, {
      method: "GET",
    });
    const ingredient = await response.json();

    return { ingredient };
  } catch (error) {
    return {
      error: "Failed to fetch browse data",
    };
  }
};

export const actions = {
  update: async ({ request }) => {

    const formData = await request.formData();
    const id = formData.get("id");

    let body = {
      common_name: formData.get("common_name"),
      cas: formData.get("cas"),
      origin: formData.get("origin"),
      other_names: formData.get("other_names"),
      use: formData.get("use"),
      associations: formData.get("associations"),
      ideas: formData.get("ideas"),
      impression: formData.get("impression"),
      volatility: formData.get("volatility"),
      colour: formData.get("colour"),
      descriptors: formData.get("descriptors"),
      id: id,
    };

    try {
      const response = await fetch(
        `/axum/collect/ci/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(body),
        },
      );

      const _ = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        return error(500)
      }
    } catch (err: any) {
      throw error(500, "Failed to edit the ingredient");
    }
  },
  delete: async ({ cookies, request }) => {
    const formData = await request.formData();
    const id = formData.get("id");

    const response = await fetch(
      `/axum/collect/ci/${id}`, {

      method: "DELETE"
    },
    );

    if (response.ok) {
      redirect(301, "/collect");
    } else {
      return error(400, "Failed to delete the ingredient");
    }
  },
} satisfies Actions;
