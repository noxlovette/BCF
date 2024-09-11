<script lang="ts">
  import AppWrap from "$lib/components/AppWrap.svelte";
    import EditFormulate from "$lib/components/EditFormulate.svelte";
    import Button from "$lib/components/UI/Button.svelte";
    import FormulaIngCell from "$lib/components/UI/FormulaIngCell.svelte";
    import Label from "$lib/components/UI/Label.svelte";
    import VariableInput from "$lib/components/UI/VariableInput.svelte";
  import type { PageServerData } from "./$types";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  

  export let data: PageServerData;
  const formula = data.formula;

  const editing = writable(false);
  setContext("editing", editing);
  
</script>

<AppWrap class='justify-between'>
  <div id="header" class="flex flex-row items-baseline justify-between w-full border-b-2 xl:border-b-4 border-stone-500 font-medium pb-4">
    <div class="w-full">
      <h1 class="text-7xl font-quicksand tracking-tight">
        {formula.name}
      </h1>
    </div>
    <div id="controls" class="flex flex-row items-baseline justify-end xl:text-2xl space-x-4">
      <Label>
        Showing
        </Label> 
      <select class="row-start-1 col-start-1 dark:bg-stone-800 py-2 px-8 border-2 xl:text-2xl rounded border-stone-500 ring-0">
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
        {#if $editing}
        Save
        {:else}
        Edit
        {/if}
      </button>
  </div>
</div>

    <div id="center" class="grid grid-cols-2 grid-rows-5 w-full items-baseline gap-4 py-4 gap-x-8">
      {#each formula.ingredients as ingredient, i}
        <FormulaIngCell {ingredient} {i} />
      {/each}
{#if $editing}
      <button class="col-span-2 text-center py-2 font-bold border-2 xl:border-4 border-stone-500 items-center justify-center rounded ">
        Add Ingredient
      </button>
{/if}
    </div>
  

  <div id="footer" class="grid grid-cols-2 w-full gap-x-8">
    <div>
    <Label>
      description
    </Label>
    <VariableInput text={formula.description} />
  </div>
  <div>
    <Label>
      notes
    </Label>
    <VariableInput text={formula.notes} />
  </div>
  </div>

</AppWrap>

{#if $editing}
<EditFormulate {formula} />
{/if}

