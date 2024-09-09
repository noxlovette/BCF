import redis from "$lib/redisClient";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, params, cookies }) => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const sessionid = cookies.get("sessionid");
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
    const endpoint = `${VITE_API_URL}/collection/api/ingredient/${slug}/`;

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
