<script lang="ts">
  import AppWrap from "$lib/components/AppWrap.svelte";
    import EditFormulate from "$lib/components/EditFormulate.svelte";

    import Label from "$lib/components/UI/Label.svelte";
    import { X } from "lucide-svelte";
    import VariableInput from "$lib/components/UI/VariableInput.svelte";
    import VariableLabel from "$lib/components/UI/VariableLabel.svelte";
    import VariableNumericInput from "$lib/components/UI/VariableNumericInput.svelte";
    import VariableTextarea from "$lib/components/UI/VariableTextarea.svelte";
    import { editedFormula, notification } from "$lib/stores";
  import type { PageServerData } from "./$types";
  import { setContext } from "svelte";
  import { writable, derived } from "svelte/store";
  import { enhance } from "$app/forms";

  export let data: PageServerData;
  let multiplier:number;
  let formula = data.formula;

  const editing = writable(false);
  setContext("editing", editing);

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

function handleEnhance() {
editing.set(false)
formula = $editedFormula
notification.set({ message: "Formula Updated", type: "success" });
}


</script>

<AppWrap class='justify-between select-text caret-aqua-700 selection:bg-aqua-700 selection:text-aqua-50'>
  <div id="header" class="flex flex-row items-baseline justify-between w-full border-b-2 xl:border-b-4 border-stone-500 font-medium pb-4">
    <div class="w-full">
      <h1 class="">
        <VariableInput text={formula.name} bind:value={$editedFormula.name} class="font-quicksand text-7xl font-medium" />
      </h1>
    </div>
    <div id="controls" class="flex flex-row items-baseline justify-end xl:text-2xl space-x-4">
      {#if $editing}
      <button type="submit" class="border-2 border-stone-500 rounded py-2 px-6" on:click={()=>editing.set(false)}>
        Cancel
      </button>
      <form method="post" action="?/delete" use:enhance>
        <input type="hidden" name="id" value={formula.id} />
        <button type="submit" class="border-2 border-stone-500 rounded py-2 px-6">
          Delete
        </button>
      </form>
      <form method="post" action="?/update" class="" use:enhance={handleEnhance}>
        <input type="hidden" name="id" value={$editedFormula.id} />
        <input type="hidden" name="fullData" bind:value={$jsonFullData} />
        <button type="submit" class="border-2 border-stone-500 rounded py-2 px-6">
          Save
        </button>
      </form>
      {:else}
      <Label>
        Showing
        </Label> 
      <select class="row-start-1 col-start-1 dark:bg-stone-800 bg-transparent focus:ring-0 focus:border-stone-500 py-2 px-8 border-2 xl:text-2xl rounded border-stone-500 ring-0"
      bind:value={multiplier}
      >
        <option value="1">1 kg</option>
        <option value="2">2 kg</option>
        <option value="3">3 kg</option>
        <option value="4">4 kg</option>
        <option value="5">5 kg</option>
        <option value="6">6 kg</option>
        <option value="7">7 kg</option>
        <option value="8">8 kg</option>
        <option value="9">9 kg</option>
      </select>
      <button on:click={() => editing.set(!$editing)}
        class="border-2 border-stone-500 rounded py-2 px-6"
        >
        Edit
      </button>
      {/if}
  </div>
</div>

    <div id="center" class="grid grid-cols-2 grid-rows-5 w-full items-baseline gap-4 py-4 gap-x-8 mb-12">
      {#each $editedFormula.ingredients as ingredient, i}
      <div class="flex flex-row justify-between">

        <div id="left-part" class="flex flex-col tracking-tight">
            <VariableLabel text={ingredient.volatility} bind:value={ingredient.volatility} />
                
            <VariableInput text={ingredient.common_name} bind:value={ingredient.common_name} class="xl:text-2xl font-medium" />
        </div>
    
        <div id="right-part" class="grid grid-cols-2 text-right w-36">
            <VariableNumericInput number={ingredient.amount * multiplier} bind:value={ingredient.amount} class="flex-shrink-0 mt-auto" />
            <VariableNumericInput number={ingredient.percentage} bind:value={ingredient.percentage} text="%" class="opacity-60 flex-shrink-0 mt-auto" />
        </div>
        {#if $editing}
        <button on:click|preventDefault={()=>removeIngredient(i)}>
            <X class="w-6 h-6" />
          </button>
          {/if}
    </div>
      {/each}
{#if $editing}
      <button class="col-span-2 text-center py-2 font-bold border-2 xl:border-4 border-stone-500 items-center justify-center rounded "
      on:click|preventDefault={addIngredient}
      >
        Add Ingredient
      </button>
{/if}
    </div>
  

  <div id="footer" class="grid grid-cols-2 w-full gap-x-8">
    <div>
    <Label>
      description
    </Label>
    <VariableTextarea text={formula.description} bind:value={$editedFormula.description} />
  </div>
  <div>
    <Label>
      notes
    </Label>
    <VariableTextarea text={formula.notes} bind:value={$editedFormula.notes} />
  </div>
  </div>

</AppWrap>

{#if $editing}
<EditFormulate {formula} />
{/if}

