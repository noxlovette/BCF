import { error } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
  default: async ({ request, fetch }) => {
    const formData = await request.formData();

    const body = {
      "commonName": formData.get("commonName"),
      "cas": formData.get("cas"),
      "markdown": formData.get("markdown"),
      "amount": 100,
      "unit": "g"
    }

    try {
      const response = await fetch(`/axum/collect`, {
        method: "POST",
        body: JSON.stringify(body),
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
} satisfies Actions;
