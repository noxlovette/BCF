<script>
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Notification from "$lib/components/Notification.svelte";
  import "../app.css";
    import MetaData from "$lib/components/MetaData.svelte";

</script>

<MetaData />

<main
  class="min-w-screen min-h-screen bg-stone-50 text-stone-800 antialiased dark:bg-stone-900 dark:text-stone-100"
>
  <Header />

  <div class="flex min-h-screen flex-col items-center justify-start">
    <slot />
  </div>

  <Notification />
  <Footer />
</main>
