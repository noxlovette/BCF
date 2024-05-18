import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";

const config = {
  kit: {
    adapter: adapter({
      // Node adapter options
      out: 'build',
      precompress: false,
      env: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || '0.0.0.0'
      }
    }),
  },
  preprocess: [vitePreprocess(), sveltePreprocess()],
};

export default config;