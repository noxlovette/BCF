import redis from "$lib/redisClient";
import getUnsplashURL from "$lib/server/unsplash";
import { error, fail } from "@sveltejs/kit";
import type { IngredientBrowse } from "$lib/types";
import type { Actions, PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

const token =
  env.VITE_TELEGRAM_BOT_TOKEN
const chatId =
  env.VITE_TELEGRAM_CHAT_ID;

export const load: PageServerLoad = async ({ fetch, params, depends }) => {
  const { slug } = params;

  depends("browse:related");
  try {
    let ingredient: IngredientBrowse | null = null;
    let cachedIngredient = await redis.get(slug);
    let photo = null;

    if (cachedIngredient !== null) {
      ingredient = JSON.parse(cachedIngredient);
    } else {
      const endpoint = `/axum/browse/${slug}/`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Failed to fetch ingredient data from API");
      }
      ingredient = await response.json();
      await redis.set(slug, JSON.stringify(ingredient), "EX", 3600);
    }

    const query = ingredient.descriptors;
    let cachedPhoto = await redis.get(`${query}-photo`);

    if (cachedPhoto !== null) {
      photo = JSON.parse(cachedPhoto);
    } else {
      const unsplashURL = getUnsplashURL(query);
      const unsplashResponse = await fetch(unsplashURL);
      if (!unsplashResponse.ok) {
        throw new Error("Failed to fetch photo from Unsplash");
      }
      photo = await unsplashResponse.json();
      await redis.set(`${query}-photo`, JSON.stringify(photo), "EX", 3600);
    }

    return { ingredient, photo };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      error: "Failed to fetch browse data",
    };
  }
};

export const actions = {
  add: async ({ request }) => {

    const data = await request.formData();
    const ingredientId = data.get("id");

    try {
      const response = await fetch(
        `/axum/collect`,
        {
          method: "POST",
          body: JSON.stringify({ ingredient_id: ingredientId }),
          credentials: "include",
        },
      );

      if (response.ok) {
        return { success: true };
      } else {
        return error(500);
      }
    } catch (err: any) {
      throw error(500, "Failed to add ingredient to collection");
    }
  },
  suggest: async ({ cookies, request }) => {
    const formData = await request.formData();

    let body = {
      ingredientId: formData.get("ingredientId"),
      commonName: formData.get("commonName"),
      cas: formData.get("cas"),
      markdown: formData.get("markdown")
    };

    try {
      const response = await fetch(
        `/axum/suggestion`,
        {
          method: "POST",
          body: JSON.stringify(body),
        },
      );

      if (response.ok) {
        const text = `
        A new suggestion has been added for ${formData.get("common_name")}.
        `;
        const response = await fetch(
          `https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          body: JSON.stringify(
            {
              chat_id: chatId,
              text: text,
            }
          )
        }
        );
        return { success: true };
      } else {
        return error(500);
      }
    } catch (err: any) {
      console.log(err)
      return error(500, "Failed to suggest a change");
    }
  },
} satisfies Actions;
