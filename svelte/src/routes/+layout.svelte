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
  class=" text-stone-80 flex min-h-screen min-w-screen flex-col items-center justify-center overflow-hidden bg-stone-100 slashed-zero tabular-nums antialiased dark:bg-stone-950 dark:text-stone-200"
>
  <Header />

  <div
    class="flex min-h-screen w-full max-w-screen flex-col items-center justify-start overscroll-contain
    md:max-w-[80vw]"
  >
    {@render children()}
  </div>
  <Loader />
  <Notification />
  <Footer />
</main>
