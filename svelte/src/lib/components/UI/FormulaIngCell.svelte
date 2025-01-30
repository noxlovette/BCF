<script lang="ts">
  import { X } from "lucide-svelte";
  import VariableInput from "./VariableInput.svelte";
  import VariableLabel from "./VariableLabel.svelte";
  import VariableNumericInput from "./VariableNumericInput.svelte";
  import { getContext } from "svelte";
  import type { FormulaIngredient } from "$lib/types";

  import { editedFormula } from "$lib/stores";
  export let ingredient: FormulaIngredient;
  export let i: number;
  export let multiplier = 1;

  export let editedIngredient: any;

  const editing = getContext("editing");

  function removeIngredient(index: number) {
    editedFormula.update((formula) => {
      return {
        ...formula,
        ingredients: formula.ingredients.filter((_, i) => i !== index),
      };
    });
  }
</script>

<div class="flex flex-row justify-between">
  <div id="left-part" class="flex flex-col tracking-tight">
    <VariableLabel
      text={ingredient.volatility}
      bind:value={editedIngredient.volatility}
    />

    <VariableInput
      text={ingredient.common_name}
      bind:value={editedIngredient.common_name}
    />
  </div>

  <div id="right-part" class="grid w-36 grid-cols-2 text-right">
    <VariableNumericInput
      number={ingredient.amount * multiplier}
      bind:value={editedIngredient.amount}
      class="mt-auto flex-shrink-0"
    />
    <VariableNumericInput
      number={ingredient.percentage}
      bind:value={editedIngredient.percentage}
      text="%"
      class="mt-auto flex-shrink-0 opacity-60"
    />
  </div>
  {#if $editing}
    <button on:click|preventDefault={() => removeIngredient(i)}>
      <X class="h-6 w-6" />
    </button>
  {/if}
</div>
