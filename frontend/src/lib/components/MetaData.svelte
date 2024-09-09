<script>
  export let description =
    "BCF. Browse perfume compounds, collect them, and formulate your next favourite fragrance.";

  export let title = "BCF";

  export let keywords =
    "perfume, formulation, fragrance, BCF, perfumers, browse, collect, formulate, ingredient, linalool, essential oil, absolute";
  let robots = "index, follow";
  export let ogTitle = "BCF";
  export let ogDescription =
    "BCF. Browse perfume compounds, collect them, and formulate your next favourite fragrance.";
  export let ogUrl = "https://bcfapp.app";
  export let ogImage = "https://bcfapp.app/assets/meta/dalle-cover-main.webp";
  let ogType = "website";
</script>

<svelte:head>
  <title>{title}</title>

  <meta name="description" content={description} />
  <meta name="keywords" content={keywords} />
  <meta name="robots" content={robots} />

  <meta property="og:title" content={ogTitle} />
  <meta property="og:description" content={ogDescription} />
  <meta property="og:url" content={ogUrl} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:type" content={ogType} />

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
