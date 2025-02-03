<script lang="ts">
  import type { IngredientBrowse } from "$lib/types";
  import { Label, MetaData } from "$lib/components";

  let { data } = $props();
  let { ingredient, unsplashData } = data;

  let href = $state("");
  if (unsplashData) {
    href = `https://unsplash.com/@${unsplashData.user.username}?utm_source=bcf&utm_medium=referral`;
  }

  let volatility = ingredient.volatility || "Unknown";
  let useMessage =
    ingredient.ingDescription || "No usage information available";
  let relatedIngredients =
    Array.isArray(ingredient.relatedIngredients) &&
    ingredient.relatedIngredients.length > 0
      ? ingredient.relatedIngredients
      : [{ commonName: "No related ingredients", slug: "" }];
  let origin = ingredient.origin || "Not specified";
  let otherNames = ingredient.otherNames || "No alternative names";
  let ifraStatus =
    ingredient.isRestricted === true ? "Restricted" : "Not restricted";

  const description = `Discover ${ingredient.commonName}. ${ingredient.descriptors}. Explore similar ingredients and fragrances.`;
  const keywords = `${ingredient.commonName}, ${ingredient.descriptors}, ${ingredient.otherNames}, ${ingredient.cas}, ${ingredient.origin}, ${volatility}`;
</script>

<MetaData
  title={ingredient.commonName}
  {description}
  {keywords}
  ogUrl={`/browse/${ingredient.slug}`}
/>

<div class="flex size-full flex-col">
  <div
    class="border-navy-500 flex w-full flex-col items-center space-y-2 border-b-2 py-4 md:border-b-3 md:py-6 xl:border-b-4"
  >
    <h1
      class="font-manrope text-center text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl xl:text-7xl"
    >
      {ingredient.commonName}
    </h1>
  </div>

  <!-- Main Content -->
  <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
    <!-- Left Column - Main Info -->
    <div class="space-y-8 lg:col-span-2">
      <!-- Descriptors & CAS -->
      <div class="rounded-lg bg-white p-6 shadow-sm">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label>Descriptors</Label>
            <div
              class="flex flex-wrap items-center gap-2 text-lg text-zinc-600 md:gap-4 md:text-xl xl:text-2xl"
            >
              {#each ingredient.descriptors as descriptor}
                <span class="rounded-md bg-zinc-100 px-3 py-1 shadow-sm"
                  >{descriptor}</span
                >
              {/each}
            </div>
          </div>
          <div>
            <Label>CAS Number</Label>
            <div
              class="flex flex-wrap items-center gap-2 text-lg text-zinc-600 md:gap-4 md:text-xl xl:text-2xl"
            >
              <span class="rounded-md bg-zinc-100 px-3 py-1 shadow-sm">
                {ingredient.cas || "Not available"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Usage Information -->
      <div class="rounded-lg bg-white p-6 shadow-sm">
        <Label>How to Use</Label>
        <p class="mt-2 min-h-24 text-lg text-zinc-700 md:min-h-36">
          {useMessage}
        </p>
      </div>

      <!-- Properties -->
      <div class="rounded-lg bg-white p-6 shadow-sm">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <Label>Volatility</Label>
            <p class="mt-2 text-lg text-zinc-700">{volatility}</p>
          </div>
          <div>
            <Label>IFRA Status</Label>
            <p class="mt-2 text-lg text-zinc-700">{ifraStatus}</p>
          </div>
          <div>
            <Label>Origin</Label>
            <p class="mt-2 text-lg text-zinc-700">{origin}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column - Additional Info -->
    <div class="space-y-6 lg:col-span-1">
      <!-- Related Ingredients / PHOTO -->
      <div
        class="relative aspect-square overflow-hidden rounded-lg bg-white shadow-sm"
      >
        {#if unsplashData}
          <img
            alt={ingredient.commonName}
            src={unsplashData.urls.regular}
            class="h-full w-full object-cover"
          />
          <p
            class="bg-opacity-75 absolute right-2 bottom-2 rounded bg-stone-50 px-2 py-1 text-sm text-stone-900 italic"
          >
            Photo by <a {href} class="underline">{unsplashData.user.name}</a> on
            <a
              href="https://unsplash.com/?utm_source=bcf&utm_medium=referral"
              class="underline">Unsplash</a
            >
          </p>
        {/if}
      </div>

      <!-- Alternative Names -->
      <div class="rounded-lg bg-white p-6 shadow-sm">
        <Label>Also Known As</Label>
        <div class="mt-2">
          {#if otherNames !== "No alternative names"}
            {#each otherNames.split(";") as name}
              <span
                class="mr-2 mb-2 inline-block rounded-lg bg-zinc-100 px-4 py-2 text-sm text-zinc-700"
              >
                {name.trim()}
              </span>
            {/each}
          {:else}
            <p class="text-zinc-500 italic">{otherNames}</p>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  :global(.prose) {
    max-width: none;
  }
</style>
