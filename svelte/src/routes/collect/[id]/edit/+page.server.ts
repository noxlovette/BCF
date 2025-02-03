import { error, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
    update: async ({ request, fetch }) => {
        const formData = await request.formData();
        const id = formData.get("id");

        let body = {
            commonName: formData.get("commonName"),
            cas: formData.get("cas"),
            otherNames: formData.get("otherNames"),
            markdown: formData.get("markdown"),
            id: id,
        };

        try {
            const response = await fetch(`/axum/collect/ci/${id}`, {
                method: "PATCH",
                body: JSON.stringify(body),
            });

            const _ = await response.json();

            if (response.ok) {
                return { success: true };
            } else {
                return error(500);
            }
        } catch (err: any) {
            throw error(500, "Failed to edit the ingredient");
        }
    },
    delete: async ({ fetch, request }) => {
        const formData = await request.formData();
        const id = formData.get("id");

        const response = await fetch(`/axum/collect/ci/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            redirect(301, "/collect");
        } else {
            return error(400, "Failed to delete the ingredient");
        }
    },
} satisfies Actions;
