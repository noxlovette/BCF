<script lang="ts">
  import { MetaData, Label, SubmitButton } from "$lib/components";
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

  function calculatePercentage(index: number) {
    const total = updatedIngredients.reduce(
      (sum, ing) => sum + (ing.amount || 0),
      0,
    );
    if (total > 0) {
      updatedIngredients[index].percentage =
        (updatedIngredients[index].amount / total) * 100;
    }
  }
</script>

<MetaData title={`Edit ${formula.title}`} />

<form
  method="POST"
  action="?/update"
  class="space-y-8 p-6"
  use:enhance={() => {
    isSubmitting = true;

    return async ({ result }) => {
      isSubmitting = false;

      if (result.type === "success") {
        notification.set({
          message: "Formula updated successfully",
          type: "success",
        });
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

  <div class="space-y-6">
    <div class="border-aqua-200 border-b pb-6">
      <Label for="title" class="mb-2 text-lg font-medium">Formula Title</Label>
      <input
        id="title"
        name="title"
        class="focus:border-aqua-500 focus:ring-aqua-200 w-full rounded-lg border border-stone-300 bg-white px-4 py-2 transition-colors focus:ring-2 dark:border-stone-600 dark:bg-stone-800"
        type="text"
        value={formula.title}
        required
      />
    </div>

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
            class="bg-aqua-500 hover:bg-aqua-600 inline-flex items-center rounded-lg px-4 py-2 text-white transition-colors"
          >
            <Plus class="mr-2 h-4 w-4" />
            Add Ingredient
          </button>
        </div>

        <div class="space-y-4">
          {#each updatedIngredients as ingredient, index}
            <input
              type="hidden"
              value={JSON.stringify(ingredient)}
              name="ingredient"
            />
            <div
              class="grid grid-cols-12 items-end gap-4 rounded-lg bg-stone-50 p-4 dark:bg-stone-900"
            >
              <div class="col-span-3">
                <Label>Name</Label>
                <input
                  class="focus:border-aqua-500 w-full border-b border-stone-300 bg-transparent px-3 py-2 transition-colors focus:outline-none"
                  type="text"
                  name={`ingredients[${index}][commonName]`}
                  value={ingredient.name}
                  placeholder="Ingredient name"
                />
              </div>
              <div class="col-span-2">
                <Label>Volatility</Label>
                <select
                  class="focus:border-aqua-500 w-full border-b border-stone-300 bg-transparent px-3 py-2 focus:outline-none"
                  name={`ingredients[${index}][volatility]`}
                  value={ingredient.volatility}
                >
                  <option value="heart">Heart</option>
                  <option value="head">Head</option>
                  <option value="base">Base</option>
                </select>
              </div>
              <div class="col-span-2">
                <Label>Amount (g)</Label>
                <input
                  class="focus:border-aqua-500 w-full border-b border-stone-300 bg-transparent px-3 py-2 focus:outline-none"
                  type="number"
                  name={`ingredients[${index}][amount]`}
                  value={ingredient.amount}
                  step="0.01"
                  required
                  oninput={() => calculatePercentage(index)}
                />
              </div>
              <div class="col-span-2">
                <Label>Percentage</Label>
                <input
                  class="focus:border-aqua-500 w-full border-b border-stone-300 bg-transparent px-3 py-2 focus:outline-none"
                  type="number"
                  name={`ingredients[${index}][percentage]`}
                  value={ingredient.percentage.toFixed(2)}
                  step="0.01"
                  readonly
                />
              </div>
              <div class="col-span-1 flex justify-end">
                <button
                  type="button"
                  onclick={() => removeIngredient(index)}
                  class="p-2 text-red-500 transition-colors hover:text-red-700"
                  title="Remove ingredient"
                >
                  <Trash2 class="h-5 w-5" />
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>
      <div class="w-1/4 rounded-xl bg-white p-4 shadow-sm dark:bg-stone-800">
        <Label for="description" class="mb-2 text-lg font-medium"
          >Description</Label
        >
        <textarea
          id="description"
          name="description"
          class="focus:border-aqua-500 focus:ring-aqua-200 mt-2 w-full rounded-lg border border-stone-300 bg-transparent px-4 py-3 transition-colors focus:ring-2"
          rows="4"
          placeholder="Enter formula description..."
          >{formula.description}</textarea
        >
      </div>
    </div>

    <div class="flex justify-end pt-4">
      <SubmitButton colour="aqua">
        <Save class="mr-2 h-5 w-5" />
        {isSubmitting ? "Saving..." : "Save Changes"}
      </SubmitButton>
    </div>
  </div>
</form>
