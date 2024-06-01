<script>
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
import Notification from "$lib/components/Notification.svelte";
import "../app.css";

  let description = "BCF. Browse perfume compounds, collect them, and formulate your next favourite fragrance.";
  let keywords = "perfume, formulation, fragrance, BCF, perfumers, browse, collect, formulate, ingredient, linalool, essential oil, absolute";
  let robots = "index, follow";
  let ogTitle = "BCF";
  let ogDescription = "BCF. Browse perfume compounds, collect them, and formulate your next favourite fragrance.";
  let ogUrl = "https://bcfapp.app";
  let ogImage = "https://bcfapp.app/assets/meta/dalle-cover-main.webp";
  let ogType = "website";

</script>
<svelte:head>
  <meta name="description" content={description}>
  <meta name="keywords" content={keywords}>
  <meta name="robots" content={robots}>

  <meta property="og:title" content={ogTitle}>
  <meta property="og:description" content={ogDescription}>
  <meta property="og:url" content={ogUrl}>
  <meta property="og:image" content={ogImage}>
  <meta property="og:type" content={ogType}>


  <script type="application/ld+json">
    {
      "@context": "http://schema.org",
      "@type": "WebApplication",
      "name": "BCF",
      "url": "https://bcfapp.app",
      "description": "BCF. Browse perfume compounds, collect them, and formulate your next favourite fragrance.",
      "applicationCategory": "LifestyleApplication",
      "operatingSystem": "All"
    }
    </script>
</svelte:head>

<main class="text-stone-800 dark:text-stone-100 dark:bg-stone-900 antialiased min-h-screen min-w-screen bg-orange-50/40">
<Header />
  <div class="flex flex-col items-center justify-start min-h-screen">
  <slot />
  </div>

<Notification />
<Footer />
</main>
