<script lang="ts">
    import { addFormulaAsCustomIngredient, deleteFormula} from "$lib/DjangoAPI";
    import FormulaEdit from "./FormulaEdit.svelte";
    import {writable } from 'svelte/store';
    import Suggestion from "$lib/icons/Suggestion.svelte";
    import DeleteIcon from "$lib/icons/DeleteIcon.svelte";
    import PuzzleIcon from "$lib/icons/PuzzleIcon.svelte";
    import ArrowsIcon from "$lib/icons/ArrowsIcon.svelte";


    export let formulaDetail;
    export let formulae;
    export let notification = writable('');
    let solventValue = 0;
    let editing = false;
    let editedFormula = null;

    $: if (formulaDetail && formulaDetail.ingredients) {
        let totalAmount = formulaDetail.ingredients.reduce((acc, ingredient) => acc + ingredient.amount, 0);
        solventValue = 1000 - totalAmount; // Recalculates whenever ingredients change
    }

  async function handleAddAsCustom (formulaDetail) {
    const response = await addFormulaAsCustomIngredient(formulaDetail);
    notification.set(response)
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
    notification.set("formula deleted");
  }

  let sortColumn = writable('ingredient'); // Default sort column
  let sortOrder = writable('asc'); // Default sort order ('asc' or 'desc')

  function sortIngredients() {
    let sorted = [...formulaDetail.ingredients];
    switch ($sortColumn) {
      case 'ingredient':
        sorted.sort((a, b) => {
          return $sortOrder === 'asc' ? a.ingredient.localeCompare(b.ingredient) : b.ingredient.localeCompare(a.ingredient);
        });
        break;
      case 'amount':
        sorted.sort((a, b) => {
          return $sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
        });
        break;
        case 'volatility':
  const order = {
    "head": 1, "head/heart": 2, "heart/head": 3, "heart": 4,
    "heart/base": 5, "base/heart": 6, null: 7
  };
  sorted.sort((a, b) => {
    const orderA = order[a.volatility] !== undefined ? order[a.volatility] : 8; // default value if not found
    const orderB = order[b.volatility] !== undefined ? order[b.volatility] : 8; // default value if not found
    return $sortOrder === 'asc' ? orderA - orderB : orderB - orderA;
  });
  break;
    }
    formulaDetail.ingredients = sorted;
  }

  // This handles the sorting logic when a header is clicked
  function handleSort(column) {
    if ($sortColumn === column) {
      sortOrder.update(n => n === 'asc' ? 'desc' : 'asc');
    } else {
      sortColumn.set(column);
      sortOrder.set('asc');
    }
    sortIngredients();
  }

</script>

{#if editing}
    <FormulaEdit {formulaDetail} {editedFormula} bind:editing bind:solventValue/>
{:else}

<div id="description-etc" class="flex flex-col mr-auto w-[220px] h-full space-y-4 bg-gradient-to-br from-lime-600 to-lime-600/80 dark:from-lime-800 dark:to-lime-800/80 text-lime-50 dark:bg-lime-800 rounded-lg shadow p-4 z-20">
  <div>
      <h3 class="text-sm">description</h3>
      <p>{formulaDetail.description}</p>
  </div>
  <div class="pt-4">
      <h3 class="text-sm">notes</h3>
      <p>{formulaDetail.notes}</p>
  </div>
  <div class="flex-grow"></div> <!-- This div will take up the remaining space -->
  <div id="controls" class="flex *:hover:p-2 *:rounded-full mt-auto">
      <button class="hover:text-lime-800 hover:bg-white dark:hover:bg-neutral-800 dark:hover:text-lime-50 transition-all hover:scale-110" on:mousedown={() => editFormula(formulaDetail)} title="edit the formula">
          <Suggestion />
      </button>
      <button class="hover:text-lime-800 hover:bg-white dark:hover:bg-neutral-800 dark:hover:text-lime-50 transition-all hover:scale-110" on:mousedown={() => handleDeleteFormula(formulaDetail.id)} title="delete the formula">
          <DeleteIcon />
      </button>
      <button class="hover:text-lime-700 hover:bg-white dark:hover:bg-neutral-800 dark:hover:text-lime-50 transition-all hover:scale-110" on:mousedown={() => handleAddAsCustom(formulaDetail)} title="add the formula to collection as ingredient">
          <PuzzleIcon />
      </button>
  </div>
</div>

  <div id="table-wrapper" class="flex flex-col items-start justify-start p-4 ml-4 size-full z-10 overflow-y-auto">
  <h2 class="text-6xl tracking-tighter mb-4">{formulaDetail.name}</h2>
  <table id="formula-ingredient-table" class="table-fixed lowercase text-left w-full">
    <thead>
      <tr class="2">
        <th class="w-1/12">#</th>
        <th class="w-1/3 cursor-pointer hover:text-lime-700 active:translate-y-1 transition-all" on:mousedown={() => handleSort('ingredient')}>
          <div class="flex items-center">
            Ingredient 
            <ArrowsIcon />
          </div>
        </th>
        
      <th class="w-1/6 cursor-pointer hover:text-lime-700 active:translate-y-1 transition-all" on:mousedown={() => handleSort('volatility')}> 
        <div class="flex items-center">
        Volatility 
        <ArrowsIcon />
      </div>
      </th>
      <th class="w-1/6 cursor-pointer hover:text-lime-700 active:translate-y-1 transition-all" on:mousedown={() => handleSort('amount')}> 
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
          <td>{ingredient.volatility}</td>
          <td>{ingredient.amount}</td>
          <td>{ingredient.percentage}</td>
        </tr>
      {/each}
      <tr id="functional" class="border-t border-lime-950/20 dark:border-lime-100/10">
        <td class="">x</td>
        <td class="">{formulaDetail.solvent}</td>
        <td class="">solvent</td>
        <td class="{solventValue < 0 ? 'text-red-700' : ''}">{solventValue}</td>
        <td class="">100</td>
      </tr>
    </tbody>
  </table>
</div>
{/if}