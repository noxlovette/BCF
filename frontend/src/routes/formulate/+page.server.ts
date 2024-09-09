import type { PageServerLoad } from "./$types";
import { error } from '@sveltejs/kit';
import redis from '$lib/redisClient';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
    try {
    const VITE_API_URL = import.meta.env.VITE_API_URL;
    const sessionid = cookies.get('sessionid');

    if (!sessionid) {
        throw error(401, 'Unauthorized');
    }

        let value = await redis.get(`formulae-${sessionid}`);
        if (value !== null) {

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

        if (!response.ok) {
            if (response.status === 403) {
                throw error(403, 'Forbidden');
            } else {
                throw error(response.status, 'Failed to fetch formulae data');
            }
        }
        const formulae:App.Formula[] = await response.json();
        await redis.set(`formulae-${sessionid}`, JSON.stringify(formulae), 'EX', 2400);

        return { formulae };

    } catch (err: any) {
        if (err.status) {
            throw error(err.status, err.body);
          }
          throw error(500, 'Internal Server Error'); // Catch any unexpected errors
        }
};
