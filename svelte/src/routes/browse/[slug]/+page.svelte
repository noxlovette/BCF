<script lang="ts">
  import type { PageServerData } from "./$types";
  import { notification } from "$lib/stores";
  import { enhance } from "$app/forms";
  import type { IngredientBrowse } from "$lib/types";
  import { user } from "$lib/stores";

  import { Label, MetaData } from "$lib/components";

  let { data } = $props();
  let ingredient: IngredientBrowse = data.ingredient;

  // Default values for optional fields
  let volatility = ingredient.volatility || "Unknown";
  let useMessage = ingredient.use || "No usage information available";
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
  <!-- Header Section -->
  <div
    class="border-navy-500 flex w-full flex-col-reverse items-baseline justify-between space-y-2 border-b-2 md:flex-row md:space-y-0 md:pb-4 xl:border-b-4"
  >
    <div class="my-4 w-full md:my-0">
      <h1
        class="font-quicksand text-3xl font-bold md:text-4xl lg:text-5xl xl:text-7xl"
      >
        {ingredient.commonName}
      </h1>
    </div>
    <div
      class="flex flex-row items-baseline justify-end space-x-2 lg:space-x-4 xl:text-2xl"
    >
      <form
        method="post"
        action="?/add"
        use:enhance={() =>
          notification.set({
            message: "Added to your collection",
            type: "success",
          })}
      >
        <input type="hidden" name="id" value={ingredient.id} />
        <button
          disabled={!$user.is_authenticated}
          class="rounded border-2 border-stone-500 px-2 py-1 disabled:border-stone-300 disabled:text-stone-400 lg:px-6 lg:py-2"
        >
          Add to Collection
        </button>
      </form>
    </div>
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
            <p class="mt-2 text-lg text-gray-700">
              {ingredient.descriptors || "No descriptors available"}
            </p>
          </div>
          <div>
            <Label>CAS Number</Label>
            <p class="mt-2 font-mono text-lg text-gray-700">
              {ingredient.cas || "Not available"}
            </p>
          </div>
        </div>
      </div>

      <!-- Usage Information -->
      <div class="rounded-lg bg-white p-6 shadow-sm">
        <Label>How to Use</Label>
        <p class="mt-2 min-h-24 text-lg text-gray-700 md:min-h-36">
          {useMessage}
        </p>
      </div>

      <!-- Properties -->
      <div class="rounded-lg bg-white p-6 shadow-sm">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <Label>Volatility</Label>
            <p class="mt-2 text-lg text-gray-700">{volatility}</p>
          </div>
          <div>
            <Label>IFRA Status</Label>
            <p class="mt-2 text-lg text-gray-700">{ifraStatus}</p>
          </div>
          <div>
            <Label>Origin</Label>
            <p class="mt-2 text-lg text-gray-700">{origin}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column - Additional Info -->
    <div class="space-y-6 lg:col-span-1">
      <!-- Related Ingredients -->
      <div class="rounded-lg bg-white p-6 shadow-sm">
        <Label>Related Ingredients</Label>
        <div class="mt-2 space-y-2">
          {#each relatedIngredients as related}
            <a
              class="hover:text-navy-700 block text-lg transition-colors"
              href="/browse/{related.slug}"
              data-sveltekit-reload
            >
              {related.commonName}
            </a>
          {/each}
        </div>
      </div>

      <!-- Alternative Names -->
      <div class="rounded-lg bg-white p-6 shadow-sm">
        <Label>Also Known As</Label>
        <div class="mt-2">
          {#if otherNames !== "No alternative names"}
            {#each otherNames.split(",") as name}
              <span
                class="mr-2 mb-2 inline-block rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700"
              >
                {name.trim()}
              </span>
            {/each}
          {:else}
            <p class="text-gray-500 italic">{otherNames}</p>
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
