import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({ fetch, url }) => {
    const VITE_API_URL = import.meta.env.VITE_API_URL;

    const page = url.searchParams.get('page') || '1';
    const search = url.searchParams.get('search') || '';
    const pageSize = url.searchParams.get('page_size') || '9';
    const descriptors = url.searchParams.getAll('descriptors') || [];

    // Construct the descriptors query string
    const descriptorsQuery = descriptors
      .map((descriptor) => `descriptors=${encodeURIComponent(descriptor)}`)
      .join('&');

    try {descriptorsQuery
        const response = await fetch(`${VITE_API_URL}/browse/api/ingredients?page=${page}&search=${search}&page_size=${pageSize}`);
        const ingredients = await response.json();
        return { ingredients };
    } catch (error) {
        console.error("Error fetching data from Django:", error);
        return {
            error: "Failed to fetch ingredients data",
        };
    }
}
