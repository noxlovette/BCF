<script>
  import "../app.css";
</script>
<svelte:head>
  <meta property="og:title" content="BCF">
  <meta property="og:description" content="BCF. Browse, collect, formulate. An app for perfumers to create and manage their unique fragrances.">
  <meta property="og:url" content="https://bcfapp.app">
  <meta property="og:image" content="https://bcfapp.app/assets/meta/dalle-cover-main-logo.webp">
  <meta property="og:type" content="website">

  <!-- Twitter Card meta tags (optional) -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="BCF">
  <meta name="twitter:description" content="BCF. Browse, collect, formulate. An app for perfumers to create and manage their unique fragrances.">
  <meta name="twitter:image" content="https://bcfapp.app/assets/meta/dalle-cover-main-logo.webp">
</svelte:head>


<div class="text-stone-800/80 bg-stone-50 dark:text-stone-100/80 dark:bg-stone-900 antialiased">
  <slot />
</div>

<style>
</style>
