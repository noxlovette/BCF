import {sequence} from "@sveltejs/kit/hooks";
import * as Sentry from "@sentry/sveltekit";
import { env } from "$env/dynamic/private";
import { handleTokenRefresh, ValidateAccess } from "$lib/server/refresh";
import type { Handle, HandleFetch } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import type { JWTPayload } from "jose";

Sentry.init({
    dsn: "https://cb2fec3778ef3f394a970f72701a67f2@o4507272574468096.ingest.de.sentry.io/4507272578203728",
    tracesSampleRate: 1
})

const PROTECTED_PATHS = new Set(["/collect", "/formulate"]);

function isProtectedPath(path: string): boolean {
  return (
    PROTECTED_PATHS.has(path) ||
    Array.from(PROTECTED_PATHS).some((prefix) => path.startsWith(prefix))
  );
}

export const handle: Handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
  const path = event.url.pathname;

  if (!isProtectedPath(path)) {
    return resolve(event);
  }

  const accessToken = event.cookies.get("accessToken");

  let user: JWTPayload;
  if (accessToken) {
    try {
      user = await ValidateAccess(accessToken);
    } catch (error) {
      user = await handleTokenRefresh(event);
    }
  } else if (event.cookies.get("refreshToken")) {
    user = await handleTokenRefresh(event);
  } else {
    throw redirect(302, "/auth/unauthorised");
  }

  const response = await resolve(event);
  return response;
});

export const handleFetch: HandleFetch = async ({ request, event, fetch }) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams.toString();
  if (url.pathname.startsWith("/axum/")) {
    const cleanPath = url.pathname.replace("/axum/", "/");
    const newUrl = new URL(cleanPath, env.BACKEND_URL);
    newUrl.search = searchParams;
    request = new Request(newUrl, request);
  }

  request.headers.set("X-API-KEY", env.API_KEY);
  request.headers.set("Content-Type", "application/json");

  const accessToken = event.cookies.get("accessToken");
  if (accessToken) {
    request.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return fetch(request);
};
export const handleError = Sentry.handleErrorWithSentry();