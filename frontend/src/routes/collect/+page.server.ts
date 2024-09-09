import redis from "$lib/redisClient";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
  try {
    const VITE_API_URL = import.meta.env.VITE_API_URL;
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

    const endpoint = `${VITE_API_URL}/collection/api/collection/`;

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
    console.log(err);
    if (err.status) {
      throw error(err.status, err.body);
    }
    throw error(500, "Internal Server Error"); // Catch any unexpected errors
  }
};
