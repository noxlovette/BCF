import redis from "$lib/redisClient";
import { parseMarkdown } from "$lib/server";
import { getUnsplashURL } from "$lib/server/unsplash";
import type { IngredientBrowse, Photo } from "$lib/types";
import { error } from "@sveltejs/kit";
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

    const query = ingredient.descriptors[0];

    const photo: Promise<Photo> = redis
      .get(`${query}-photo`)
      .then(async (unsplashData) => {
        if (unsplashData && unsplashData !== null) {
          return JSON.parse(unsplashData);
        } else {
          const unsplashURL = getUnsplashURL(query);
          const unsplashResponse = await fetch(unsplashURL);

          const data = await unsplashResponse.json();
          if (data.errors || !unsplashResponse.ok || data === null) {
            throw error(400);
          } else {
            await redis.set(`${query}-photo`, JSON.stringify(data), "EX", 3600);
            return data;
          }
        }
      });

    let markdown = "Nobody has shared the description yet";
    if (ingredient.ingDescription) {
      markdown = await parseMarkdown(ingredient.ingDescription);
    }

    return { ingredient, markdown, photo };
  } catch (error) {
    return {
      error: "Failed to fetch browse data",
    };
  }
};
