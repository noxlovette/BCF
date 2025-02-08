import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      out: "build",
      precompress: false,
    }),
    version: {
      name: child_process.execSync("git rev-parse HEAD").toString().trim(),
    },
    csrf: {
      checkOrigin: true,
    },
  },
};

export default config;
