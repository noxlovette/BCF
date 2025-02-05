<script lang="ts">
  import { MetaData, Label, EditButton } from "$lib/components";

  let { data } = $props();
  let multiplier = $state(1);
  let { formula } = data;
</script>

<MetaData title={formula.title} />

<div class="flex size-full flex-col">
  <div
    class="border-aqua-500 flex w-full flex-col items-center space-y-2 border-b-2 py-4 md:border-b-3 md:py-6 xl:border-b-4"
  >
    <h1
      class="font-manrope text-center text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl xl:text-7xl"
    >
      {formula.title}
    </h1>
  </div>

  <!-- Ingredients List -->
  <div class="mt-8 rounded-lg bg-white p-6 shadow-sm dark:bg-stone-900">
    <div class="flex justify-between">
      <h2 class="mb-6 text-xl font-semibold">Ingredients</h2>
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
  <div class="mt-8 rounded-lg bg-white p-6 shadow-sm dark:bg-stone-900">
    <Label>Description</Label>
    <p class="mt-2 text-lg text-gray-700">
      {formula.description || "No description available"}
    </p>
  </div>
  <EditButton href="{formula.id}/edit" colour="aqua" styling="self-center"
    >Edit</EditButton
  >
</div>
