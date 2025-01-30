import type { Handle, HandleFetch } from "@sveltejs/kit";
import { env } from '$env/dynamic/private';


export const handleFetch: HandleFetch = async ({ request, event, fetch }) => {
  const url = new URL(request.url);
  if (url.pathname.startsWith('/django/')) {
    const cleanPath = url.pathname.replace('/django/', '/');
    const newUrl = new URL(cleanPath, env.BACKEND_URL);
    request = new Request(newUrl, request);
  }

  return fetch(request);
};
