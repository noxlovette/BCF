import { sequence } from "@sveltejs/kit/hooks";
import { handleErrorWithSentry, sentryHandle } from "@sentry/sveltekit";
import * as Sentry from '@sentry/sveltekit';

if (process.env.NODE_ENV === 'production') {
Sentry.init({
  dsn: 'https://cb2fec3778ef3f394a970f72701a67f2@o4507272574468096.ingest.de.sentry.io/4507272578203728',
  tracesSampleRate: 1.0,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: import.meta.env.DEV,  
});
}
// If you have custom handlers, make sure to place them after `sentryHandle()` in the `sequence` function.
export const handle = sequence(sentryHandle());
// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
