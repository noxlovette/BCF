import redis from "$lib/redisClient";
import { getUnsplashURL } from "$lib/server/unsplash";
import type { IngredientBrowse } from "$lib/types";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ fetch, params }) => {
  const { slug } = params;
  try {
    const endpoint = `/axum/browse/${slug}`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error("Failed to fetch ingredient data from API");
    }
    const ingredient: IngredientBrowse = await response.json();
    await redis.set(slug, JSON.stringify(ingredient), "EX", 3600);

    const query = ingredient.descriptors[0]; // WATCH OUT – ONLY THE FIRST DESCRIPTOR!
    let unsplashData;

    let cachedPhoto = await redis.get(`${query}-photo`);

    if (cachedPhoto !== null) {
      unsplashData = JSON.parse(cachedPhoto);
    } else {
      const unsplashURL = getUnsplashURL(query);
      const unsplashResponse = await fetch(unsplashURL);
      if (!unsplashResponse.ok) {
        unsplashData = null;
      }
      unsplashData = await unsplashResponse.json();
      await redis.set(
        `${query}-photo`,
        JSON.stringify(unsplashData),
        "EX",
        3600,
      );
    }

    return { ingredient, unsplashData };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      error: "Failed to fetch browse data",
    };
  }
};
