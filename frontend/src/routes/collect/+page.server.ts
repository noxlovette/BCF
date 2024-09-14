import redis from "$lib/redisClient";
import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

const VITE_API_URL = "http://backend:8000";
export const load: PageServerLoad = async ({ cookies }) => {
  try {
    const sessionid = cookies.get("sessionid");

    if (!sessionid) {
      throw error(401, "Unauthorized");
    }

    const cacheKey = `collection-${sessionid}`;
    const value = await redis.get(cacheKey);
    if (value !== null) {
      return {
        collection: JSON.parse(value),
      };
    }

    const endpoint = `${VITE_API_URL}/collection/new/api/collection/`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `sessionid=${sessionid}`,
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw error(403, "Forbidden"); // Properly throw the 403 error
      } else {
        throw error(response.status, "Failed to fetch collection data");
      }
    }

    const data: App.IngredientCollection[] = await response.json();

    // Cache the result
    await redis.set(cacheKey, JSON.stringify(data), "EX", 1800);

    return {
      collection: data,
    };
  } catch (err: any) {
    // Ensure all thrown errors are caught
    if (err.status) {
      throw error(err.status, err.body);
    }
    throw error(500, "Internal Server Error"); // Catch any unexpected errors
  }
};

export const actions = {
  create: async ({ cookies, request }) => {

    const sessionid = cookies.get("sessionid");
    const csrfToken = cookies.get("csrftoken");

    if (!sessionid) {
      throw error(401, "Unauthorized");
    }

    const response = await fetch(
      `${VITE_API_URL}/collection/new/api/ingredient/create/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
          Cookie: `sessionid=${sessionid}; csrftoken=${csrfToken}`,
        },
        credentials: "include",
      },
    );

    if (response.ok) {
      redis.del(`collection-${sessionid}`);
      const data = await response.json();
      redirect(301, data.url);
    } else {
      const errorData = await response.json();

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
  },
} satisfies Actions;
