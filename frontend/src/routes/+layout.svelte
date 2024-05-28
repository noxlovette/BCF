<script>
  import "../app.css";
</script>
<svelte:head>
  <meta name="description" content="BCF. Browse perfume compounds, collect them, and formulate your next favourite fragrance.">
  <meta name="keywords" content="perfume, formulation, fragrance, BCF, perfumers, browse, collect, formulate, ingredient, linalool, essential oil, absolute">
  <meta name="robots" content="index, follow">


  <meta property="og:title" content="BCF">
  <meta property="og:description" content="BCF. Browse perfume compounds, collect them, and formulate your next favourite fragrance.">
  <meta property="og:url" content="https://bcfapp.app">
  <meta property="og:image" content="https://bcfapp.app/assets/meta/dalle-cover-main-logo.webp">
  <meta property="og:type" content="website">

  <!-- Twitter Card meta tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="BCF">
  <meta name="twitter:description" content="BCF. Browse perfume compounds, collect them, and formulate your next favourite fragrance.">
  <meta name="twitter:image" content="https://bcfapp.app/assets/meta/dalle-cover-main-logo.webp">


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


<div class="text-stone-800 dark:text-stone-100 dark:bg-stone-900 antialiased min-h-screen w-screen bg-orange-50/40">
  <slot />
</div>

<style>
</style>
