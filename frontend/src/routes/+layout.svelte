<script lang="ts">
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Notification from "$lib/components/Notification.svelte";
  import "../app.css";
  import MetaData from "$lib/components/MetaData.svelte";
  import type { LayoutData } from "./$types";
  import { setUser } from "$lib/stores";
  import { onMount } from "svelte";
    import Loader from "$lib/components/Loader.svelte";

  export let data: LayoutData;

  onMount(() => {
    setUser(data.user);
  });
</script>

<MetaData />

<main
  class="min-w-screen flex min-h-screen flex-col items-center justify-center hyphens-auto bg-stone-100 slashed-zero tabular-nums text-stone-800 antialiased dark:bg-stone-800 dark:text-stone-200"
>
  <Header />

  <div
    class="flex min-h-screen w-full max-w-[80vw] flex-col items-center
    justify-start
    overscroll-contain px-4 md:px-8"
  >
    <slot />
  </div>
  <Loader />
  <Notification />
  <Footer />
</main>
