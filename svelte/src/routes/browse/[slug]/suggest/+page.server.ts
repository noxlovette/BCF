import { env } from "$env/dynamic/private";
import { error, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

const token = env.TELEGRAM_BOT_TOKEN;
const chatId = env.TELEGRAM_CHAT_ID;

export const actions = {
  default: async ({ request, fetch }) => {
    const formData = await request.formData();
    let body = {
      ingredientId: formData.get("id"),
      commonName: formData.get("commonName"),
      cas: formData.get("cas"),
      markdown: formData.get("markdown"),
    };

    const response = await fetch(`/axum/suggestion`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    const text = `
        A new suggestion has been added for ${formData.get("commonName")}.
        `;
    const _ = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });
    if (response.ok) {
      return redirect(301, ".");
    } else {
      return error(400, "Failed to delete the ingredient");
    }
  },
} satisfies Actions;
