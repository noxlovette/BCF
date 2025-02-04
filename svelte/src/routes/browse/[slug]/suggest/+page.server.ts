import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";
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

        try {
            const response = await fetch(`/axum/suggestion`, {
                method: "POST",
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const text = `
        A new suggestion has been added for ${formData.get("commonName")}.
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
