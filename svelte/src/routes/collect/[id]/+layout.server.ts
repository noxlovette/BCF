import type { IngredientCollection } from "$lib/types";
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ fetch, params }) => {
    const { id } = params;
    try {
        const endpoint = `/axum/collect/ci/${id}`;

        const response = await fetch(endpoint, {
            method: "GET",
        });
        const ingredient: IngredientCollection = await response.json();

        console.log(ingredient);

        return {
            ingredient,
        };
    } catch (error) {
        return {
            error: "Failed to fetch browse data",
        };
    }
};