<script lang="ts">
  import { MetaData, EditButton, HeaderMerger, Label } from "$lib/components";
  import { FormulaIngCell } from "$lib/components";

  let { data } = $props();
  let multiplier = $state(1);
  let { formula, ingredients } = data;
</script>

<MetaData title={formula.title} />

<div class="flex size-full flex-col">
  <HeaderMerger colour="hunter">
    {formula.title}
  </HeaderMerger>
  <!-- Main Container -->
  <div class="grid w-full grid-cols-1 gap-8 lg:grid-cols-3">
    <!-- Ingredients List -->
    <div
      class="col-span-2 space-y-6 rounded-xl bg-white p-6 shadow-sm dark:bg-stone-800"
    >
      <div class="item s-center flex justify-between">
        <h2 class="text-xl font-semibold">Ingredients</h2>
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
        {#each ingredients
          .slice()
          .sort((a, b) => b.amount - a.amount) as ingredient}
          <FormulaIngCell {multiplier} {ingredient} />
        {/each}
        <!-- Totals -->
        <div
          class="mt-6 flex items-center justify-between border-t border-stone-500 pt-4"
        >
          <span class="font-semibold">Total</span>
          <div class="flex space-x-6">
            <div class="text-right">
              <span class="text-lg font-medium">
                {(
                  ingredients.reduce((sum, ing) => sum + ing.amount, 0) *
                  multiplier
                ).toFixed(2)}g
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- Description -->
    </div>
    <div class="flex h-full flex-col space-y-4">
      <div class="flex-1 rounded-xl bg-white p-4 shadow-sm dark:bg-stone-800">
        <Label>Description</Label>
        <p class="mt-2 text-lg">
          {formula.description || "No description available"}
        </p>
      </div>
      <EditButton
        href="{formula.id}/edit"
        colour="hunter"
        styling="place-self-end">Edit Formula</EditButton
      >
    </div>
  </div>
</div>
