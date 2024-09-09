// src/routes/+layout.server.ts

import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
const VITE_API_URL = import.meta.env.VITE_API_URL;
  const sessionid = cookies.get('sessionid');
  const endpoint = `${VITE_API_URL}/api/check-session/`;
  
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Cookie': `sessionid=${sessionid}`,
    }
  })

  const user:App.User = await response.json();

  return { user };
};
