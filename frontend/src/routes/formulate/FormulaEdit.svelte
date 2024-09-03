<script lang="ts">
  import { updated } from "$app/stores";

  export let formulae = null;

  import {
    saveChangesFormula,
    deleteIngredientFormulate,
    fetchFormulas,
  } from "$lib/DjangoAPI";
  import AddCrossIcon from "$lib/icons/AddCrossIcon.svelte";
  import CancelButton from "$lib/icons/CancelButton.svelte";
  import CrossIcon from "$lib/icons/CrossIcon.svelte";

  import OkIcon from "$lib/icons/OkIcon.svelte";
  import { notification } from "$lib/stores/notificationStore";

  import Dropdown from "./Dropdown.svelte";
  export let editedFormula = null;
  export let formulaDetail = null;
  export let editing = true;
  export let solventValue = 0;
  let activeEditId = null;
  export let ingredientCounter = 0;

  $: if (editedFormula && editedFormula.ingredients) {
    let totalAmount = editedFormula.ingredients.reduce(
      (acc, ingredient) => acc + ingredient.amount,
      0,
    );
    solventValue = 1000 - totalAmount; // Recalculates whenever ingredients change
  }

  function toggleEdit(id) {
    activeEditId = activeEditId === id ? null : id; // Toggle edit mode on and off
  }

  async function handleDeleteIngredient(ingredientId) {
    let response = deleteIngredientFormulate(ingredientId);

    editedFormula.ingredients = editedFormula.ingredients.filter(
      (ingredient) => ingredient.id !== ingredientId,
    );
  }

  let updatedIngredients = [];

  async function saveChanges() {
    // Save the changes to the server here...
    updatedIngredients = editedFormula.ingredients.map((ingredient, i) => {
      let updatedIngredient = {
        id: ingredient.id,
        collection_ingredient_id: ingredient.collection_ingredient_id,
        custom_collection_ingredient_id:
          ingredient.custom_collection_ingredient_id,
        amount: ingredient.amount,
        percentage: ingredient.percentage,
      };

      // If the ingredient ID starts with 'new-', set it to null
      if (
        typeof ingredient.id === "string" &&
        ingredient.id.startsWith("new-")
      ) {
        updatedIngredient.id = null;
      }
      editing = false;
      return updatedIngredient;
    });

    const formData = {
      name: editedFormula.name,
      description: editedFormula.description,
      notes: editedFormula.notes,
      ingredients: updatedIngredients,
      solvent: editedFormula.solvent,
    };
    editing = false;

    let data = await saveChangesFormula(formData, editedFormula.id);

    formulaDetail = data;
    editedFormula = data;

    notification.set({ message: "Changes saved", type: "success" });
    formulae = await fetchFormulas({ forceReload: true });
  }

  function addIngredient() {
    // Create a new ingredient object
    let newIngredient = {
      id: `new-${ingredientCounter}`, // Use the counter to generate a unique id
      ingredient: "", // Set the initial ingredient to an empty string
      volatility: "", // Set the initial volatility to an empty string
      amount: 0, // Set the initial amount to 0
      percentage: 10, // Set the initial percentage to 0
    };

    // Push the new ingredient to the editedFormula.ingredients array
    editedFormula.ingredients.push(newIngredient);

    // Reassign the array to trigger a reactive update
    editedFormula.ingredients = [...editedFormula.ingredients];

    ingredientCounter++; // Increment the counter

    activeEditId = newIngredient.id; // Set the active edit ID to the new ingredient ID
  }
</script>

<div
  id="description-etc"
  class="z-20 mr-auto flex h-full w-[175px] flex-col space-y-4 rounded-lg bg-aqua-600 p-4 text-aqua-50 shadow lg:w-[220px] dark:bg-aqua-800"
>
  <div>
    <h3 class="text-sm">description</h3>
    <textarea
      class="w-full rounded-lg border-none bg-aqua-600 p-0 ring-0 focus:ring-0 dark:bg-aqua-800"
      bind:value={editedFormula.description}
    />
  </div>
  <div>
    <h3 class="text-sm">notes</h3>
    <textarea
      class="w-full rounded-lg border-none bg-aqua-600 p-0 ring-0 focus:ring-0 dark:bg-aqua-800"
      bind:value={editedFormula.notes}
    />
  </div>
  <div class="flex-grow"></div>
  <!-- This div will take up the remaining space -->

  <div
    id="controls"
    class="mt-auto pt-4 *:rounded-full *:hover:p-1 lg:*:hover:p-2"
  >
    <button
      tabindex="-1"
      class="transition-all hover:scale-110 hover:bg-white hover:text-aqua-800 dark:hover:bg-neutral-800 dark:hover:text-aqua-50"
      title="save changes"
      on:mousedown={saveChanges}
    >
      <OkIcon />
    </button>
    <button
      tabindex="-1"
      class="transition-all hover:scale-110 hover:bg-white hover:text-aqua-800 dark:hover:bg-neutral-800 dark:hover:text-aqua-50"
      title="cancel changes"
      on:mousedown={() => {
        editing = false;
        editedFormula = null;
      }}
    >
      <CancelButton />
    </button>
  </div>
</div>
<div
  id="table-wrapper"
  class="z-10 ml-4 flex size-full scroll-m-2 flex-col items-start justify-start overflow-y-auto p-4"
>
  <input
    class="border-none p-0 text-6xl tracking-tighter ring-0 focus:ring-0 dark:bg-neutral-800"
    bind:value={editedFormula.name}
  />
  <table
    id="formula-ingredient-table"
    class="m-2 w-full table-fixed pl-2 text-left lowercase"
  >
    <thead>
      <tr class="">
        <th class="w-1/12"></th>
        <th class="w-1/3"> Ingredient </th>
        <th class="w-1/6"> Volatility </th>
        <th class="w-1/6"> Amount </th>
        <th class="w-1/6"> % </th>
      </tr>
    </thead>
    <tbody>
      {#if editedFormula.ingredients}
        {#each editedFormula.ingredients as ingredient, i (ingredient.id)}
          <tr class="">
            <td class="align-middle">
              <button
                tabindex="-1"
                class="rounded-full p-1 transition-all hover:scale-110 hover:bg-aqua-700 hover:text-aqua-50 dark:hover:text-aqua-950"
                on:mousedown={() => handleDeleteIngredient(ingredient.id)}
              >
                <CrossIcon />
              </button>
            </td>
            <td>
              {#if activeEditId === ingredient.id}
                <Dropdown
                  bind:selectedIngredient={ingredient}
                  searchTerm={ingredient.ingredient}
                />
              {:else}
                <button
                  tabindex="-1"
                  on:mousedown={() => toggleEdit(ingredient.id)}
                  >{ingredient.ingredient}</button
                >
              {/if}
            </td>

            <td class="cursor-not-allowed">{ingredient.volatility}</td>
            <!-- unchangeable -->

            <td>
              <input
                type="number"
                bind:value={ingredient.amount}
                class="flex w-2/3 rounded-lg border-none p-1 text-aqua-700 focus:ring-0 dark:bg-neutral-800"
              />
            </td>
            <td>
              <input
                type="number"
                bind:value={ingredient.percentage}
                class="flex w-2/3 rounded-lg border-none p-1 text-aqua-700 focus:ring-0 dark:bg-neutral-800"
              />
            </td>
          </tr>
        {/each}
      {/if}
      <td colspan="5" class="align-middle">
        <button
          tabindex="-1"
          class="mx-auto my-2 rounded-full p-2 transition-all hover:scale-110 hover:bg-aqua-700 hover:text-aqua-50 dark:hover:text-aqua-950"
          on:mousedown={addIngredient}
        >
          <AddCrossIcon />
        </button>
      </td>

      <tr
        id="functional"
        class="border-t border-aqua-950/20 dark:border-aqua-100/10"
      >
        <td></td>
        <td>
          <input
            type="text"
            bind:value={editedFormula.solvent}
            placeholder="solvent"
            class="flex w-2/3 rounded-lg border-none text-aqua-700 focus:ring-0 dark:bg-neutral-800"
          />
        </td>
        <td>solvent</td>
        <td class={solventValue < 0 ? "text-red-700" : ""}>{solventValue}</td>
        <td>100</td>
      </tr>
    </tbody>
  </table>
</div>
