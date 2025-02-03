<script lang="ts">
  import type { IngredientCollection } from "$lib/types";
  import MetaData from "$lib/components/MetaData.svelte";

  let { data } = $props();
  let ingredient: IngredientCollection = data.ingredient;

  function formatValue(
    value: string | null | undefined,
    defaultText = "Not available",
  ): string {
    return value?.trim() || defaultText;
  }

  const otherNames = formatValue(
    ingredient.otherNames,
    "No alternative names available",
  );
  const description = formatValue(
    ingredient.markdown,
    "No description available",
  );
  const casNumber = formatValue(ingredient.cas, "CAS number not available");
</script>

<MetaData
  title={formatValue(ingredient.commonName)}
  robots="noindex, nofollow"
/>

<div class="my-4 flex size-full flex-col">
  <div
    class="border-peach-500 flex w-full flex-col items-center space-y-2 border-b-2 py-4 md:border-b-3 md:py-6 xl:border-b-4"
  >
    <h1
      class="font-manrope text-center text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl xl:text-7xl"
    >
      {formatValue(ingredient.commonName, "Unnamed Ingredient")}
    </h1>
  </div>

  <!-- Main Content Grid -->
  <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
    <!-- Left Column - Main Info -->
    <div class="lg:col-span-2">
      <!-- CAS Number Card -->
      <div class="mb-6 rounded-lg bg-white p-6 shadow-sm">
        <h2 class="mb-3 text-xl font-semibold text-stone-900">CAS Number</h2>
        <p class="font-mono text-lg text-stone-700">
          {casNumber}
        </p>
      </div>

      <!-- Description Card -->
      <div class="mb-6 rounded-lg bg-white p-6 shadow-sm">
        <h2 class="mb-3 text-xl font-semibold text-stone-900">Description</h2>
        <div class="prose prose-lg max-w-none text-stone-700">
          {description}
        </div>
      </div>
    </div>

    <!-- Right Column - Additional Info -->
    <div class="lg:col-span-1">
      <!-- Also Known As Card -->
      <div class="rounded-lg bg-white p-6 shadow-sm">
        <h2 class="mb-3 text-xl font-semibold text-stone-900">Also Known As</h2>
        <div class="space-y-2">
          {#if otherNames !== "No alternative names available"}
            {#each otherNames.split(",") as name}
              <div
                class="mr-2 mb-2 inline-block rounded-full bg-stone-100 px-4 py-2 text-sm text-stone-700"
              >
                {name.trim()}
              </div>
            {/each}
          {:else}
            <p class="text-stone-500 italic">{otherNames}</p>
          {/if}
        </div>
      </div>
    </div>
  </div>
  <a
    href="{ingredient.id}/edit"
    class="bg-peach-600 hover:bg-peach-700
    focus:ring-peach-500 text-peach-50 inline-flex items-center
    self-start rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm
    transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none sm:self-center lg:text-2xl"
  >
    Edit
  </a>
</div>

<style>
  :global(.prose) {
    max-width: none;
  }
</style>
