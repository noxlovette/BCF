import redis from "$lib/redisClient";
import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({
  fetch,
  params,
  cookies,
  depends,
}) => {
  const sessionid = cookies.get("sessionid");
  depends("collect:update");
  if (!sessionid) {
    throw error(401, "Unauthorized");
  }

  const { slug } = params;
  try {
    let value = await redis.get(`ingredient-${sessionid}-${slug}`);
    if (value !== null) {
      return {
        ingredient: JSON.parse(value),
      };
    }
    const endpoint = `django/collection/new/api/ingredient/${slug}/`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `sessionid=${sessionid}`,
      },
    });
    const ingredient = await response.json();
    await redis.set(
      `ingredient-${sessionid}-${slug}`,
      JSON.stringify(ingredient),
      "EX",
      3600,
    );
    return { ingredient };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      error: "Failed to fetch browse data",
    };
  }
};

export const actions = {
  update: async ({ cookies, request }) => {
    const sessionid = cookies.get("sessionid");
    const csrfToken = cookies.get("csrftoken");
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

    if (!sessionid) {
      throw error(401, "Unauthorized");
    }
    try {
      const response = await fetch(
        `django/collection/new/api/ingredient/update/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
            Cookie: `sessionid=${sessionid}; csrftoken=${csrfToken}`,
          },
          body: JSON.stringify(body),
          credentials: "include",
        },
      );

      const data = await response.json();

      if (response.ok) {
        redis.del(`ingredient-${sessionid}-${id}`);
        return { success: true };
      } else {
        return { success: false, error: response.error || "An error occurred" };
      }
    } catch (err: any) {
      throw error(500, "Failed to edit the ingredient");
    }
  },
  delete: async ({ cookies, request }) => {
    const sessionid = cookies.get("sessionid");
    const csrfToken = cookies.get("csrftoken");
    const formData = await request.formData();
    const id = formData.get("id");

    const response = await fetch(
      `django/collection/new/api/ingredient/delete/${id}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
          Cookie: `sessionid=${sessionid}; csrftoken=${csrfToken}`,
        },
        credentials: "include",
      },
    );

    if (response.ok) {
      redis.del(`ingredient-${sessionid}-${id}`);
      redis.del(`collection-${sessionid}`);
      redirect(301, "/collect");
    } else {
      throw error(400, "Failed to delete the ingredient");
    }
  },
} satisfies Actions;
