<script lang="ts">
  import {
    MetaData,
    Label,
    SubmitButton,
    Input,
    HeaderMerger,
    CancelButton,
  } from "$lib/components";
  import { notification } from "$lib/stores";
  import { enhance } from "$app/forms";
  import { Trash2, Plus, Save } from "lucide-svelte";

  let isSubmitting = $state(false);

  let { data } = $props();
  let { formula, ingredients } = data;

  let updatedIngredients = $state([...ingredients]);

  function addIngredient() {
    updatedIngredients = [
      ...updatedIngredients,
      {
        name: "",
        counterpartId: "",
        formulaId: formula.id,
        volatility: "heart",
        amount: 0,
        percentage: 0,
        unit: "g",
      },
    ];
  }

  function removeIngredient(index: number) {
    updatedIngredients = updatedIngredients.filter((_, i) => i !== index);
  }
</script>

<MetaData title={`Edit ${formula.title}`} />

<HeaderMerger colour="hunter">
  {formula.title}
</HeaderMerger>

<form
  method="POST"
  action="?/update"
  class="space-y-8"
  use:enhance={() => {
    isSubmitting = true;

    return async ({ result, update }) => {
      isSubmitting = false;

      if (result.type === "redirect") {
        notification.set({
          message: "Formula updated successfully",
          type: "success",
        });
        update();
      } else if (result.type === "failure") {
        notification.set({
          message: String(result.data?.message) || "Failed to update formula",
          type: "error",
        });
      } else if (result.type === "error") {
        notification.set({
          message: String(result.error?.message) || "An error occurred",
          type: "error",
        });
      }
    };
  }}
>
  <input type="hidden" value={formula.id} name="id" />

  <!-- Main Container -->
  <div class="flex gap-4">
    <div
      class="flex-1 space-y-6 rounded-xl bg-white p-6 shadow-sm dark:bg-stone-800"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">Ingredients</h2>
        <button
          type="button"
          onclick={addIngredient}
          class="bg-hunter-500 hover:bg-hunter-600 inline-flex items-center rounded-lg px-4 py-2 text-white transition-colors"
        >
          <Plus class="mr-2 h-4 w-4" />
          Add Ingredient
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full border-collapse overflow-hidden shadow-md">
          <thead
            class="sticky top-0 bg-stone-200 text-stone-900 dark:bg-stone-800 dark:text-stone-100"
          >
            <tr>
              <th class="p-3 text-left">Name</th>
              <th class="p-3 text-left">Volatility</th>
              <th class="p-3 text-left">Amount (g)</th>
              <th class="p-3 text-left">Percentage</th>
              <th class="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody
            class="divide-y divide-stone-300 bg-white dark:divide-stone-700 dark:bg-stone-900"
          >
            {#each updatedIngredients as ingredient, index}
              <tr
                class=" transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <!-- Name Input -->
                <td class="p-3">
                  <input
                    class="focus:border-hunter-500 ring-hunter-600 w-full rounded-md border border-stone-300 bg-transparent px-2 py-1 transition focus:outline-none dark:border-stone-700"
                    type="text"
                    name={`ingredients[${index}][commonName]`}
                    bind:value={ingredient.name}
                    placeholder="Ingredient name"
                  />
                  <input
                    type="hidden"
                    value={JSON.stringify(ingredient)}
                    name="ingredient"
                  />
                </td>

                <!-- Volatility Selection -->
                <td class="p-3">
                  <select
                    class="focus:border-hunter-500 ring-hunter-600 w-full rounded-md border border-stone-300 bg-transparent px-2 py-1 transition focus:outline-none dark:border-stone-700"
                    name={`ingredients[${index}][volatility]`}
                    bind:value={ingredient.volatility}
                  >
                    <option value="heart">Heart</option>
                    <option value="head">Head</option>
                    <option value="base">Base</option>
                  </select>
                </td>

                <!-- Amount Input -->
                <td class="p-3">
                  <input
                    class="focus:border-hunter-500 ring-hunter-600 w-full rounded-md border border-stone-300 bg-transparent px-2 py-1 transition focus:outline-none dark:border-stone-700"
                    type="number"
                    name={`ingredients[${index}][amount]`}
                    bind:value={ingredient.amount}
                    step="1"
                    required
                  />
                </td>

                <!-- Percentage Input (readonly) -->
                <td class="p-3">
                  <input
                    class="ring-hunter-600 w-full rounded-md border border-stone-300 bg-transparent px-2 py-1 transition focus:outline-none dark:border-stone-700"
                    type="number"
                    name={`ingredients[${index}][percentage]`}
                    bind:value={ingredient.percentage}
                    step="0.01"
                  />
                </td>

                <!-- Action Button -->
                <td class="p-3 text-center">
                  <button
                    type="button"
                    onclick={() => removeIngredient(index)}
                    class="rounded-full bg-red-500 p-2 text-white transition hover:bg-red-600 focus:ring-2 focus:ring-red-400"
                    title="Remove ingredient"
                  >
                    <Trash2 class="h-5 w-5" />
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
    <div class="w-1/4 rounded-xl bg-white p-4 shadow-sm dark:bg-stone-800">
      <Label>Formula Title</Label>
      <Input
        name="title"
        type="text"
        placeholder="Make it matter"
        value={formula.title}
        colour="hunter"
      />
      <Label>Description</Label>
      <Input
        name="description"
        placeholder="Enter formula description"
        colour="hunter"
        type="textarea"
        value={formula.description}
      />
    </div>
  </div>

  <div class="flex justify-end space-x-4">
    <CancelButton></CancelButton>
    <SubmitButton colour="hunter">
      <Save class="mr-2 h-5 w-5" />
      {isSubmitting ? "Saving..." : "Save Changes"}
    </SubmitButton>
  </div>
</form>
