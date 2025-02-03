import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: "danila-volkov",
        project: "bcf-frontend",
        authToken: process.env.SENTRY_AUTH_TOKEN,
        url: "https://danila-volkov.sentry.io/",
      },
    }),
    sveltekit(),
  ],

  server: {
    host: true,
    port: 3000,
  },
});
