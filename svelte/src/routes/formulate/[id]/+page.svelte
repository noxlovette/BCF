<script lang="ts">
  import Label from "$lib/components/typography/Label.svelte";
  import type { PageServerData } from "./$types";
  import MetaData from "../../../lib/components/MetaData.svelte";

  export let data: PageServerData;
  let multiplier = 1;
  let formula = data.formula;
</script>

<MetaData title={formula.title} />

<div class="flex size-full flex-col">
  <div
    class="border-aqua-700 flex w-full flex-col-reverse items-baseline justify-between space-y-2 border-b-2 md:flex-row md:space-y-0 md:pb-4 xl:border-b-4"
  >
    <div class="my-4 w-full md:my-0">
      <h1
        class="font-quicksand text-3xl font-bold md:text-4xl lg:text-5xl xl:text-7xl"
      >
        {formula.title}
      </h1>
    </div>

    <div class="flex flex-row items-center space-x-4">
      <Label>Quantity</Label>
      <select
        class="rounded border-2 border-stone-500 bg-transparent px-4 py-1 ring-0 focus:border-stone-500 focus:ring-0 lg:px-8 lg:py-2"
        bind:value={multiplier}
      >
        {#each Array(9) as _, i}
          <option value={i + 1}>{i + 1} kg</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Ingredients List -->
  <div class="mt-8 rounded-lg bg-white p-6 shadow-sm">
    <h2 class="mb-6 text-xl font-semibold">Ingredients</h2>
    <div class="space-y-4">
      {#each formula.ingredients as ingredient}
        <div
          class="flex items-center justify-between rounded-lg bg-gray-50 p-4"
        >
          <div class="flex flex-col">
            <span class="text-sm text-gray-600 capitalize"
              >{ingredient.volatility}</span
            >
            <a
              href="/collect/{ingredient.counterpart}"
              class="hover:text-aqua-700 text-lg transition-colors"
            >
              {ingredient.commonName}
            </a>
          </div>

          <div class="flex space-x-6 text-right">
            <div class="flex flex-col">
              <span class="text-sm text-gray-600">Amount</span>
              <span class="text-lg font-medium">
                {(ingredient.amount * multiplier).toFixed(2)}g
              </span>
            </div>
            <div class="flex flex-col">
              <span class="text-sm text-gray-600">Percentage</span>
              <span class="text-lg text-gray-600">
                {ingredient.percentage.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      {/each}

      <!-- Totals -->
      <div
        class="mt-6 flex items-center justify-between border-t border-gray-200 pt-4"
      >
        <span class="font-semibold">Total</span>
        <div class="flex space-x-6">
          <div class="text-right">
            <span class="text-lg font-medium">
              {(
                formula.ingredients.reduce((sum, ing) => sum + ing.amount, 0) *
                multiplier
              ).toFixed(2)}g
            </span>
          </div>
          <div class="w-20 text-right">
            <span class="text-lg text-gray-600">
              {formula.ingredients
                .reduce((sum, ing) => sum + ing.percentage, 0)
                .toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Description -->
  <div class="mt-8 rounded-lg bg-white p-6 shadow-sm">
    <Label>Description</Label>
    <p class="mt-2 text-lg text-gray-700">
      {formula.description || "No description available"}
    </p>
  </div>
</div>

<style>
  :global(.prose) {
    max-width: none;
  }
</style>
