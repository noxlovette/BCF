import type { PageServerLoad } from "./$types";
import redis from '$lib/redisClient';

export const load: PageServerLoad = async ({ fetch, cookies, params }) => {
    const VITE_API_URL = import.meta.env.VITE_API_URL;
    const sessionid = cookies.get('sessionid');
    const { slug } = params;
    try {
        let value = await redis.get(`formula-${sessionid}-${slug}`);
        if (value !== null) {

            return {
                formulae: JSON.parse(value),
            };
        }
        const endpoint = `${VITE_API_URL}/formulae/api/formula/${slug}/`;

        const response = await fetch(endpoint,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `sessionid=${sessionid}`,
                },
            }
        );
        const formula = await response.json();
        await redis.set(`formulae-${sessionid}-${slug}`, JSON.stringify(formula), 'EX', 2400);

        return { formula };

    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            error: "Failed to fetch formulae data",
        };
    }
}
