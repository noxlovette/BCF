import { env } from "$env/dynamic/private";
import redis from "$lib/redisClient";
import type { IngredientBrowse } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

const token = env.TELEGRAM_BOT_TOKEN;
const chatId = env.TELEGRAM_CHAT_ID;

export const load: PageServerLoad = async ({ fetch, params }) => {
  const { slug } = params;
  try {
    const endpoint = `/axum/browse/${slug}`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error("Failed to fetch ingredient data from API");
    }
    const ingredient: IngredientBrowse = await response.json();
    await redis.set(slug, JSON.stringify(ingredient), "EX", 3600);
    console.log(ingredient);
    return { ingredient };
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
      const response = await fetch(`/axum/collect`, {
        method: "POST",
        body: JSON.stringify({ ingredient_id: ingredientId }),
        credentials: "include",
      });

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
      markdown: formData.get("markdown"),
    };

    try {
      const response = await fetch(`/axum/suggestion`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const text = `
        A new suggestion has been added for ${formData.get("common_name")}.
        `;
        const response = await fetch(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            method: "POST",
            body: JSON.stringify({
              chat_id: chatId,
              text: text,
            }),
          },
        );
        return { success: true };
      } else {
        return error(500);
      }
    } catch (err: any) {
      console.log(err);
      return error(500, "Failed to suggest a change");
    }
  },
} satisfies Actions;
