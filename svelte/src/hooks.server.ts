import * as Sentry from "@sentry/sveltekit";
import { handleErrorWithSentry, sentryHandle } from "@sentry/sveltekit";
import type { HandleFetch } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { env } from '$env/dynamic/private';

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    environment: process.env.NODE_ENV,
    dsn: "https://cb2fec3778ef3f394a970f72701a67f2@o4507272574468096.ingest.de.sentry.io/4507272578203728",
    tracesSampleRate: 1.0,

  });
}
// If you have custom handlers, make sure to place them after `sentryHandle()` in the `sequence` function.
export const handle = sequence(sentryHandle());
// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();

export const handleFetch: HandleFetch = async ({ request, fetch }) => {
  const url = new URL(request.url);

  if (url.pathname.startsWith('/django/')) {
    const cleanPath = url.pathname.replace('/django/', '/');
    const newUrl = new URL(cleanPath, env.BACKEND_URL);
    request = new Request(newUrl, request);
  }

  return fetch(request);
};
