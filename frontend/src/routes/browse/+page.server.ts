import type { PageServerLoad } from "./$types";
import redis from '$lib/redisClient';

export const load: PageServerLoad = async ({ fetch, url }) => {
    const VITE_API_URL = import.meta.env.VITE_API_URL;

    const page = url.searchParams.get('page') || '1';
    const search = url.searchParams.get('search') || '';
    const pageSize = url.searchParams.get('page_size') || '9';
    const descriptors = url.searchParams.getAll('descriptors') || [];

    try {
        // Fetch and cache ingredients
        const cacheKeyIngredients = `browse-${page}-${search}-${pageSize}`;
        let ingredients: App.ResponseBrowse;

        const cachedIngredients = await redis.get(cacheKeyIngredients);
        if (cachedIngredients) {
            ingredients = await JSON.parse(cachedIngredients);

        } else {
            const response = await fetch(`${VITE_API_URL}/browse/api/ingredients?page=${page}&search=${search}&page_size=${pageSize}`);
            ingredients = await response.json();
            await redis.set(cacheKeyIngredients, JSON.stringify(ingredients), 'EX', 7200);
            console.log('Ingredients fetched from API');
        }

        // Fetch and cache descriptors
        const cacheKeyDescriptors = `browse-descriptors`;
        let descriptors: App.Descriptor[];

        const cachedDescriptors = await redis.get(cacheKeyDescriptors);
        if (cachedDescriptors) {
            descriptors = await JSON.parse(cachedDescriptors);

        } else {
            const response = await fetch(`${VITE_API_URL}/browse/api/descriptors/`);
            descriptors = await response.json();
            await redis.set(cacheKeyDescriptors, JSON.stringify(descriptors), 'EX', 7200);
            console.log('Descriptors fetched from API');
        }

        return { ingredients, descriptors };

    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            error: "Failed to fetch ingredients data",
        };
    }
};
