import redis from "$lib/redisClient";
import { error,redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ fetch, cookies, params }) => {
  try {
    const VITE_API_URL = import.meta.env.VITE_API_URL;
    const sessionid = cookies.get("sessionid");
    if (!sessionid) {
      throw error(401, "Unauthorized");
    }

    const { slug } = params;
    let value = await redis.get(`formula-${sessionid}-${slug}`);
    if (value !== null) {
      return {
        formulae: JSON.parse(value),
      };
    }
    const endpoint = `${VITE_API_URL}/formulae/api/new/formula/${slug}/`;

    

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `sessionid=${sessionid}`,
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw error(403, "Forbidden");
      } else {
        throw error(response.status, "Failed to fetch formula data");
      }
    }

    const formula: App.Formula = await response.json();
    await redis.set(
      `formula-${sessionid}-${slug}`,
      JSON.stringify(formula),
      "EX",
      2400,
    );

    return { formula };
  } catch (err: any) {
    if (err.status) {
      throw error(err.status, err.body);
    }
    throw error(500, "Internal Server Error"); // Catch any unexpected errors
  }
};

export const actions = {
  update: async ({ cookies, request }) => {
    const VITE_API_URL = import.meta.env.VITE_API_URL;
    const sessionid = cookies.get("sessionid");
    const csrfToken = cookies.get("csrftoken");
    const formData = await request.formData();
    const id = formData.get("id");

    let body = {
      name: formData.get("name"),
      description: formData.get("description"),
      ideas: formData.get("ideas"),
      ingredients: [], //TODO 
      id: id,
    };

    if (!sessionid) {
      throw error(401, "Unauthorized");
    }
    try {
      const response = await fetch(`${VITE_API_URL}/formulae/api/new/formula/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
          Cookie: `sessionid=${sessionid}; csrftoken=${csrfToken}`,
        },
        body: JSON.stringify(body),
        credentials: 'include',
      });
  
      if (response.ok) {
//TODO make the page RELOAD
        redis.del(`formula-${sessionid}-${id}`);
      
        return { success: true };
      } else {

        return { success: false, error: response.error || "An error occurred" };
      }

    } catch (err: any) {
      throw error(500, "Failed to edit the ingredient");
    }
  },
  delete: async ({ cookies, request }) => {
    const VITE_API_URL = import.meta.env.VITE_API_URL;
    const sessionid = cookies.get("sessionid");
    const csrfToken = cookies.get("csrftoken");
    const formData = await request.formData();
    const id = formData.get("id");

    const response = await fetch(`${VITE_API_URL}/formulae/api/formula/delete/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
        Cookie: `sessionid=${sessionid}; csrftoken=${csrfToken}`,
      },
      credentials: 'include',
    });

    if (response.ok) {
      redis.del(`formula-${sessionid}-${id}`);
      redis.del(`formulae-${sessionid}`);
      redirect(301, "/formulate");
    } else {
      throw error(400, "Failed to delete the formula");
    }
  }
  
} satisfies Actions;