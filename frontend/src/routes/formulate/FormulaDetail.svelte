<script lang="ts">
  import { addFormulaAsCustomIngredient, deleteFormula } from "$lib/DjangoAPI";
  import FormulaEdit from "./FormulaEdit.svelte";
  import { writable } from "svelte/store";
  import Suggestion from "$lib/icons/Suggestion.svelte";
  import DeleteIcon from "$lib/icons/DeleteIcon.svelte";
  import PuzzleIcon from "$lib/icons/PuzzleIcon.svelte";
  import ArrowsIcon from "$lib/icons/ArrowsIcon.svelte";
  import { notification } from "$lib/stores/notificationStore";

  export let formulaDetail;
  export let formulae;
  let solventValue = 0;
  let editing = false;
  let editedFormula = null;
  let ingredientCounter = 0;

  $: if (formulaDetail && formulaDetail.ingredients) {
    let totalAmount = formulaDetail.ingredients.reduce(
      (acc, ingredient) => acc + ingredient.amount,
      0,
    );
    solventValue = 1000 - totalAmount; // Recalculates whenever ingredients change
  }

  async function handleAddAsCustom(formulaDetail) {
    const response = await addFormulaAsCustomIngredient(formulaDetail);
    notification.set({ message: response, type: "success" });
  }

  function editFormula(formula) {
    editing = true;
    editedFormula = formula;
  }

  async function handleDeleteFormula(formulaId) {
    formulaDetail = null;
    let data = await deleteFormula(formulaId);

    // Remove the deleted formula from the formulae array
    formulae = formulae.filter((formula) => formula.id !== formulaId);
    notification.set({ message: "formula deleted", type: "success" });
  }

  let sortColumn = writable("ingredient"); // Default sort column
  let sortOrder = writable("asc"); // Default sort order ('asc' or 'desc')

  function sortIngredients() {
    let sorted = [...formulaDetail.ingredients];
    switch ($sortColumn) {
      case "ingredient":
        sorted.sort((a, b) => {
          return $sortOrder === "asc"
            ? a.ingredient.localeCompare(b.ingredient)
            : b.ingredient.localeCompare(a.ingredient);
        });
        break;
      case "amount":
        sorted.sort((a, b) => {
          return $sortOrder === "asc"
            ? a.amount - b.amount
            : b.amount - a.amount;
        });
        break;
      case "volatility":
        const order = {
          head: 1,
          "head/heart": 2,
          "heart/head": 3,
          heart: 4,
          "heart/base": 5,
          "base/heart": 6,
          null: 7,
        };
        sorted.sort((a, b) => {
          const volatilityA = a.volatility ? a.volatility.toLowerCase() : null;
          const volatilityB = b.volatility ? b.volatility.toLowerCase() : null;

          const orderA =
            order[volatilityA] !== undefined ? order[volatilityA] : 8; // default value if not found
          const orderB =
            order[volatilityB] !== undefined ? order[volatilityB] : 8; // default value if not found

          return $sortOrder === "asc" ? orderA - orderB : orderB - orderA;
        });
        break;
    }
    formulaDetail.ingredients = sorted;
  }

  // This handles the sorting logic when a header is clicked
  function handleSort(column) {
    if ($sortColumn === column) {
      sortOrder.update((n) => (n === "asc" ? "desc" : "asc"));
    } else {
      sortColumn.set(column);
      sortOrder.set("asc");
    }
    sortIngredients();
  }
</script>

{#if editing}
  <FormulaEdit
    {editedFormula}
    bind:formulaDetail
    bind:editing
    bind:solventValue
    bind:formulae
    bind:ingredientCounter
  />
{:else}
  <div
    id="description-etc"
    class="z-20 mr-auto flex h-full w-[175px] flex-col space-y-4 rounded-lg bg-aqua-800 p-4 text-aqua-50 shadow lg:w-[220px] dark:bg-aqua-800 dark:from-aqua-800 dark:to-aqua-800/80"
  >
    <div>
      <h3 class="text-sm">description</h3>
      <p>{formulaDetail.description}</p>
    </div>
    <div class="pt-4">
      <h3 class="text-sm">notes</h3>
      <p>{formulaDetail.notes}</p>
    </div>
    <div class="flex-grow"></div>
    <!-- This div will take up the remaining space -->
    <div
      id="controls"
      class="mt-auto flex *:rounded-full *:p-2 justify-between"
    >
      <button
        class="transition-all hover:bg-white hover:text-aqua-800 dark:hover:bg-stone-800 dark:hover:text-aqua-50"
        on:mousedown={() => editFormula(formulaDetail)}
        title="edit the formula"
      >
        <Suggestion />
      </button>
      <button
        class="transition-all hover:bg-white hover:text-aqua-800 dark:hover:bg-stone-800 dark:hover:text-aqua-50"
        on:mousedown={() => handleDeleteFormula(formulaDetail.id)}
        title="delete the formula"
      >
        <DeleteIcon />
      </button>
      <button
        class="transition-all hover:bg-white hover:text-aqua-700 dark:hover:bg-stone-800 dark:hover:text-aqua-50"
        on:mousedown={() => handleAddAsCustom(formulaDetail)}
        title="add the formula to collection as ingredient"
      >
        <PuzzleIcon />
      </button>
    </div>
  </div>

  <div
    id="table-wrapper"
    class="z-10 ml-4 flex size-full flex-col items-start justify-start overflow-y-auto p-4"
  >
    <h2 class="mb-4 text-6xl tracking-tighter">{formulaDetail.name}</h2>
    <table
      id="formula-ingredient-table"
      class="w-full table-fixed text-left lowercase"
    >
      <thead>
        <tr class="2">
          <th class="w-1/12">#</th>
          <th
            class="w-1/3 cursor-pointer transition-all hover:text-aqua-700 active:translate-y-1"
            on:mousedown={() => handleSort("ingredient")}
          >
            <div class="flex items-center">
              Ingredient
              <ArrowsIcon />
            </div>
          </th>

          <th
            class="hidden w-1/6 cursor-pointer transition-all hover:text-aqua-700 active:translate-y-1 lg:table-cell"
            on:mousedown={() => handleSort("volatility")}
          >
            <div class="flex items-center">
              Volatility
              <ArrowsIcon />
            </div>
          </th>
          <th
            class="w-1/6 cursor-pointer transition-all hover:text-aqua-700 active:translate-y-1"
            on:mousedown={() => handleSort("amount")}
          >
            <div class="flex items-center">
              Amount
              <ArrowsIcon />
            </div>
          </th>
          <th class="w-1/6"> % </th>
        </tr>
      </thead>
      <tbody class="rounded-lg">
        {#each formulaDetail.ingredients as ingredient, i (ingredient.id)}
          <tr class="">
            <td class="p-1">{i + 1}</td>
            <td>{ingredient.ingredient}</td>
            <td class="hidden lg:table-cell">{ingredient.volatility}</td>
            <td>{ingredient.amount}</td>
            <td>{ingredient.percentage}</td>
          </tr>
        {/each}
        <tr
          id="functional"
          class="border-t border-aqua-950/20 dark:border-aqua-100/10"
        >
          <td class="">x</td>
          <td class="">{formulaDetail.solvent}</td>
          <td class="hidden lg:table-cell">solvent</td>
          <td class={solventValue < 0 ? "text-red-700" : ""}>{solventValue}</td>
          <td class="">100</td>
        </tr>
      </tbody>
    </table>
  </div>
{/if}
