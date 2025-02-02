<script lang="ts">
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Notification from "$lib/components/Notification.svelte";
  import "../app.css";
  import MetaData from "$lib/components/MetaData.svelte";
  import Loader from "$lib/components/Loader.svelte";

  let { children } = $props();
</script>

<MetaData />

<main
  class="flex min-h-screen min-w-screen flex-col items-center justify-center overflow-hidden bg-stone-100 text-stone-800 slashed-zero tabular-nums antialiased dark:bg-stone-800 dark:text-stone-200"
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
