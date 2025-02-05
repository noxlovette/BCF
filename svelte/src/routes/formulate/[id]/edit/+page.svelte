<script lang="ts">
  import { MetaData, Label, SubmitButton } from "$lib/components";
  import { enhance } from "$app/forms";

  let { data } = $props();
  let { formula } = data;
  let ingredients = $state([...formula.ingredients]);

  function addIngredient() {
    ingredients = [
      ...ingredients,
      {
        id: null,
        name: "",
        volatility: "heart",
        amount: 0,
        percentage: 0,
        unit: "g",
      },
    ];
  }

  function removeIngredient(index: number) {
    ingredients = ingredients.filter((_, i) => i !== index);
  }
</script>

<MetaData title={`Edit ${formula.title}`} />

<form
  use:enhance
  method="POST"
  action="?/update"
  class="flex size-full flex-col space-y-6"
>
  <input type="hidden" value={formula.id} name="id" />

  <div class="border-aqua-700 flex flex-col border-b-2 pb-4 xl:border-b-4">
    <Label for="title">Title</Label>
    <input
      id="title"
      name="title"
      class="rounded border-2 border-stone-500 bg-transparent px-4 py-2 focus:border-stone-500 focus:ring-0"
      type="text"
      value={formula.title}
      required
    />
  </div>

  <div
    class="rounded-lg bg-white p-6 shadow-sm dark:bg-stone-900 dark:bg-stone-900"
  >
    <h2 class="mb-6 text-xl font-semibold">Edit Ingredients</h2>
    <div class="space-y-4">
      {#each ingredients as ingredient, index}
        <input
          type="hidden"
          value={JSON.stringify(ingredient)}
          name="ingredient"
        />
        <div class="flex items-center justify-between rounded-lg p-4">
          <div class="flex flex-col">
            <Label>Name</Label>
            <input
              class="hover:text-aqua-700 border-b-2 border-gray-400 bg-transparent text-lg transition-colors focus:outline-none"
              type="text"
              name={`ingredients[${index}][commonName]`}
              value={ingredient.commonName}
            />
          </div>
          <div class="flex flex-col">
            <Label>Volatility</Label>
            <input
              class="hover:text-aqua-700 border-b-2 border-gray-400 bg-transparent text-lg transition-colors focus:outline-none"
              type="text"
              name={`ingredients[${index}][volatility]`}
              value={ingredient.volatility}
            />
          </div>

          <div class="flex space-x-6 text-right">
            <div class="flex flex-col">
              <Label for={`amount-${index}`}>Amount (g)</Label>
              <input
                id={`amount-${index}`}
                class="border-b-2 border-gray-400 bg-transparent text-lg font-medium focus:outline-none"
                type="number"
                name={`ingredients[${index}][amount]`}
                value={ingredient.amount}
                step="0.01"
                required
              />
            </div>
            <div class="flex flex-col">
              <Label for={`percentage-${index}`}>Percentage (%)</Label>
              <input
                id={`percentage-${index}`}
                class="border-b-2 border-gray-400 bg-transparent text-lg text-gray-600 focus:outline-none"
                type="number"
                name={`ingredients[${index}][percentage]`}
                value={ingredient.percentage}
                step="0.01"
                required
              />
            </div>
          </div>
          <button
            type="button"
            onclick={() => removeIngredient(index)}
            class="text-red-600 hover:text-red-800"
          >
            ✖
          </button>
        </div>
      {/each}
      <div class="mt-4 flex justify-start">
        <button
          type="button"
          onclick={addIngredient}
          class="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
        >
          + Add Ingredient
        </button>
      </div>
    </div>

    <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-stone-900">
      <Label for="description">Description</Label>
      <textarea
        id="description"
        name="description"
        class="mt-2 w-full rounded border-2 border-stone-500 bg-transparent p-4 text-lg text-gray-700 focus:border-stone-500 focus:ring-0"
        rows="4">{formula.description}</textarea
      >
    </div>

    <div class="flex justify-end">
      <SubmitButton>Save Changes</SubmitButton>
    </div>
  </div>
</form>
