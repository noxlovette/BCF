import adapter from "svelte-adapter-bun";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";

const config = {
  kit: {
    adapter: adapter({
      out: "build",
      precompress: false,
    }),
  },
  csrf: {
    checkOrigin: false
  },
  preprocess: [vitePreprocess(), sveltePreprocess()],
};

export default config;