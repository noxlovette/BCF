<script lang="ts">
    import { editedFormula } from "$lib/stores";
    import { derived } from "svelte/store";
    import { enhance } from "$app/forms";

    export let formula: App.Formula;

editedFormula.set(formula);
const jsonFullData = derived(editedFormula, ($editedFormula) => JSON.stringify($editedFormula));

  function addIngredient() {
    editedFormula.update((formula) => {
      return {
        ...formula,
        ingredients: [
          ...formula.ingredients,
          {
            common_name: "",
            amount: 0,
            percentage: 0,
            volatility: "heart",
            formula_id: formula.id,
            id: null,
            unit: "g",
          },
        ],
      };
    });
  }

  function removeIngredient(index:number) {
  editedFormula.update((formula) => {
    return {
      ...formula,
      ingredients: formula.ingredients.filter((_, i) => i !== index),
    };
  });
}

</script>
<form method="post" action="?/update" use:enhance>
    <div class="dark:bg-black *:dark:bg-black">
    <input type="text" name="notes" bind:value={$editedFormula.notes} />
    <input type="text" name="name" bind:value={$editedFormula.name} />
    <input type="text" name="description" bind:value={$editedFormula.description} />
    <input type="text" name="solvent" bind:value={$editedFormula.solvent} />
      <input type="hidden" name="id" value={$editedFormula.id} />
    <input type = "hidden" name="fullData" bind:value={$jsonFullData} />
      <button type="submit">
        update
      </button>
      <button on:click|preventDefault={addIngredient}>
  add new ing
      </button>
      <div id="ingredient holder" class="flex flex-col space-y-2 *:dark:bg-black">
        {#each $editedFormula.ingredients as ingredient, i}
        <input type="text" name="ingredients" placeholder="name" bind:value="{$editedFormula.ingredients[i].common_name}" />
        <input type="text" name="ingredients" placeholder="amount" bind:value="{$editedFormula.ingredients[i].amount}" />
        <input type="text" name="ingredients" placeholder="percentage" bind:value="{$editedFormula.ingredients[i].percentage}" />
        <input type="text" name="ingredients" placeholder="volatility" bind:value="{$editedFormula.ingredients[i].volatility}" />
        <button on:click|preventDefault={()=>removeIngredient(i)}>
          delete ingredient
        </button>
        {/each}
      </div>
        </div>
  
    </form>
  
    <form method="post" action="?/delete" use:enhance>
      <input type="hidden" name="id" value={formula.id} />
      <button type="submit">
        delete
      </button>
    </form>