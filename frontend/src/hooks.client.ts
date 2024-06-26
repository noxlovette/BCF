import * as Sentry from "@sentry/sveltekit";
import { handleErrorWithSentry, replayIntegration } from "@sentry/sveltekit";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://cb2fec3778ef3f394a970f72701a67f2@o4507272574468096.ingest.de.sentry.io/4507272578203728",
    tracesSampleRate: 1.0,

    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0.1,

    // If the entire session is not sampled, use the below sample rate to sample
    // sessions when an error occurs.
    replaysOnErrorSampleRate: 1.0,

    // If you don't want to use Session Replay, just remove the line below:
    integrations: [replayIntegration()],
  });
}

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
