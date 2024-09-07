import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";
import redis from '$lib/redisClient';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
    const VITE_API_URL = import.meta.env.VITE_API_URL;
    const sessionid = cookies.get('sessionid');

    try {
        let value = await redis.get(`formulae-${sessionid}`);
        if (value !== null) {
            console.log('Cache hit!');
            return {
                formulae: JSON.parse(value),
            };
        }


        const endpoint = `${VITE_API_URL}/formulae/api/formula/list/`;

        const response = await fetch(endpoint,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `sessionid=${sessionid}`,
                },
            }
        );
        const formulae = await response.json();
        await redis.set(`formulae-${sessionid}`, JSON.stringify(formulae), 'EX', 120);
        console.log('Cache miss!');
        return { formulae };

    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            error: "Failed to fetch formulae data",
        };
    }
}

