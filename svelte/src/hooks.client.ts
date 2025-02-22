import { env } from "$env/dynamic/public";
import { setUser } from "$lib/stores";
import * as Sentry from "@sentry/sveltekit";
import type { ClientInit } from "@sveltejs/kit";

Sentry.init({
  dsn: "https://cb2fec3778ef3f394a970f72701a67f2@o4507272574468096.ingest.de.sentry.io/4507272578203728",
  tracesSampleRate: 1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  environment: env.PUBLIC_APP_ENV || "development",
  integrations: [Sentry.replayIntegration()],
});

export const init: ClientInit = async () => {
  const user = localStorage.getItem("user") || "";
  if (user) {
    setUser(JSON.parse(user));
  }
};
export const handleError = Sentry.handleErrorWithSentry();
