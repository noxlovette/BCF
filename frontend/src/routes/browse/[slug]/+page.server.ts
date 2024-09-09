import redis from "$lib/redisClient";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const { slug } = params;
  try {
    let value = await redis.get(slug);
    if (value !== null) {
      return {
        ingredient: JSON.parse(value),
      };
    }
    const endpoint = `${VITE_API_URL}/browse/api/ingredients/${slug}/`;

    const response = await fetch(endpoint);
    const ingredient = await response.json();
    await redis.set(slug, JSON.stringify(ingredient), "EX", 3600);
    return { ingredient };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      error: "Failed to fetch browse data",
    };
  }
};
