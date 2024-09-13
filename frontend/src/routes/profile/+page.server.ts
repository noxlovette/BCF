import type { PageServerLoad } from "./$types";
import {error, redirect} from "@sveltejs/kit";
import type { Actions } from "$lib/types";

export const load: PageServerLoad = async ({ fetch, cookies, depends }) => {
    const VITE_API_URL = import.meta.env.VITE_API_URL;
    const sessionid = cookies.get("sessionid");
    depends("profile:update");
    if (!sessionid) {
        throw error(401, "Unauthorized");
    }
    
    try {
        const endpoint = `${VITE_API_URL}/browse/api/suggested-ingredients/`;
        const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Cookie: `sessionid=${sessionid}`,
        },
        });
        const suggestedIngredients = await response.json();

        return { suggestedIngredients };
    } catch (error) {
        console.error("Error fetching data:", error);
        return {
        error: "Failed to fetch profile data",
        };
    }
    }

    export const actions = {
        logout: async ({ cookies }) => {
          const sessionid = cookies.get("sessionid");
      
          if (!sessionid) {
            throw error(401, "Unauthorized");
          }
          cookies.delete("sessionid", { path: '/' });
          redirect(301, "/browse");
        },
      } satisfies Actions;
      
