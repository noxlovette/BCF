<script lang="ts">
  import {
    Header,
    Footer,
    Notification,
    MetaData,
    Loader,
  } from "$lib/components";
  import "../app.css";

  let { children } = $props();
</script>

<MetaData />

<main
  class="flex min-h-screen min-w-screen flex-col items-center justify-center overflow-hidden bg-zinc-100 text-zinc-800 slashed-zero tabular-nums antialiased dark:bg-zinc-800 dark:text-zinc-200"
>
  <Header />

  <div
    class="my-8 flex min-h-screen w-full max-w-[80vw] flex-col items-center justify-start
    overscroll-contain
    md:my-0"
  >
    {@render children()}
  </div>
  <Loader />
  <Notification />
  <Footer />
</main>
