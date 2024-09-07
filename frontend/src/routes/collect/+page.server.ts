import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import redis from '$lib/redisClient';

export const load: PageServerLoad = async ({ cookies }) => {
  try {
    const VITE_API_URL = import.meta.env.VITE_API_URL;
    const sessionid = cookies.get('sessionid');

    if (!sessionid) {
      throw error(401, 'Unauthorized');
    }

    const cacheKey = `collection-${sessionid}`;
    const value = await redis.get(cacheKey);
    if ( value !== null) {
      return {
        collection: JSON.parse(value),
      };
    }

    const endpoint = `${VITE_API_URL}/collection/api/collection/`;

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `sessionid=${sessionid}`,
        },
    }
    );

    if (!response.ok) {
      throw error(response.status, 'Failed to fetch collection data');
    }

    const data:App.IngredientCollection[] = await response.json();

    redis.set(cacheKey, JSON.stringify(data), 'EX', 1800);
    return {
      collection: data
    };

  } catch (err) {
    console.error("Error fetching collection data:", err);
    throw error(500, 'Failed to fetch collection data');
  }
};
