import redis from "$lib/redisClient";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";

export const load: PageServerLoad = async ({ fetch, cookies }) => {
  try {
    const VITE_API_URL = import.meta.env.VITE_API_URL;
    const sessionid = cookies.get("sessionid");

    if (!sessionid) {
      throw error(401, "Unauthorized");
    }

    let value = null // await redis.get(`formulae-${sessionid}`);
    if (value !== null) {
      return {
        formulae: JSON.parse(value),
      };
    }

    const endpoint = `${VITE_API_URL}/formulae/api/new/formula/list/`;

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
        throw error(response.status, "Failed to fetch formulae data");
      }
    }
    const formulae: App.Formula[] = await response.json();
    await redis.set(
      `formulae-${sessionid}`,
      JSON.stringify(formulae),
      "EX",
      2400,
    );

    return { formulae };
  } catch (err: any) {
    if (err.status) {
      throw error(err.status, err.body);
    }
    throw error(500, "Internal Server Error"); // Catch any unexpected errors
  }
};

export const actions = {
  create: async ({ cookies, request }) => {
    const VITE_API_URL = import.meta.env.VITE_API_URL;
    const sessionid = cookies.get("sessionid");
    const csrfToken = cookies.get("csrftoken");
    const body = {
      name: "New Formula",
      description: "Write something inspiring here!",
      notes: "Add some notes here...",
      ingredients: [],
      solvent: null,
    };


    if (!sessionid) {
      throw error(401, "Unauthorized");
    }

      const response = await fetch(`${VITE_API_URL}/formulae/api/formula/new/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
          Cookie: `sessionid=${sessionid}; csrftoken=${csrfToken}`,
        },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      if (response.ok) {
      const data = await response.json();
      redis.del(`formulae-${sessionid}`);
      redirect(301, data.url);
} else {
  const errorData = await response.json();
        console.error('Server response:', response.status, errorData);

        return { success: false, error: response.error || "An error occurred" };
      }    
  },
  reset: async ({ cookies }) => {
    const sessionid = cookies.get("sessionid");

    if (!sessionid) {
      throw error(401, "Unauthorized");
    }

    redis.del(`collection-${sessionid}`);
    redirect(301, "/collect");
  }
} satisfies Actions;