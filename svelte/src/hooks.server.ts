import type { Handle, HandleFetch } from "@sveltejs/kit";
import { env } from '$env/dynamic/private';
import { handleTokenRefresh, ValidateAccess } from "$lib/server/refresh";
import type { JWTPayload } from "jose";
import { redirect } from '@sveltejs/kit';

const PROTECTED_PATHS = new Set(['/collect/', '/formulate/']);

function isProtectedPath(path: string): boolean {
  return (
    PROTECTED_PATHS.has(path) ||
    Array.from(PROTECTED_PATHS).some((prefix) => path.startsWith(prefix))
  );
}

export const handle: Handle = async ({ event, resolve }) => {
  const path = event.url.pathname;

  if (!isProtectedPath(path)) {
    return resolve(event);
  }

  const accessToken = event.cookies.get('accessToken');
  let user: JWTPayload;
  if (accessToken) {
    try {
      user = await ValidateAccess(accessToken);
    } catch (error) {
      user = await handleTokenRefresh(event);
    }
  } else if (event.cookies.get('refreshToken')) {
    user = await handleTokenRefresh(event);
  } else {
    throw redirect(302, '/auth/login');
  }

  const response = await resolve(event);
  return response;
};


export const handleFetch: HandleFetch = async ({ request, event, fetch }) => {
  const url = new URL(request.url);
  if (url.pathname.startsWith('/axum/')) {
    const cleanPath = url.pathname.replace('/axum/', '/');
    const newUrl = new URL(cleanPath, env.BACKEND_URL);
    request = new Request(newUrl, request);
  }

  request.headers.set('X-API-KEY', env.API_KEY);
  request.headers.set('Content-Type', 'application/json');

  const accessToken = event.cookies.get('accessToken');
  if (accessToken) {
    request.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return fetch(request);
};
