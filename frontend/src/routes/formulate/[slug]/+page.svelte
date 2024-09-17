<script lang="ts">
  import AppWrap from "$lib/components/AppWrap.svelte";
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
  let multiplier: number;
  let formula = data.formula;

  const editing = writable(false);
  setContext("editing", editing);

  editedFormula.set(formula);

  const jsonFullData = derived(editedFormula, ($editedFormula) =>
    JSON.stringify($editedFormula),
  );

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

  function removeIngredient(index: number) {
    editedFormula.update((formula) => {
      return {
        ...formula,
        ingredients: formula.ingredients.filter((_, i) => i !== index),
      };
    });
  }

  function handleEnhance() {
    editing.set(false);
    formula = $editedFormula;
    notification.set({ message: "Formula Updated", type: "success" });
  }
</script>

<AppWrap
  class="select-text justify-between caret-aqua-700 selection:bg-aqua-700 selection:text-aqua-50"
>
  <div
    id="header"
    class="
    flex w-full flex-col-reverse items-baseline
    justify-between space-y-2
    border-b-2
    border-aqua-700 font-medium md:flex-row md:space-y-0 md:pb-4 xl:border-b-4"
  >
    <div class="my-4 w-full md:my-0">
      <h1 class="">
        <VariableInput
          text={formula.name}
          bind:value={$editedFormula.name}
          class="font-quicksand text-3xl font-bold md:text-4xl lg:text-5xl xl:text-7xl"
        />
      </h1>
    </div>
    <div
      id="controls"
      class="flex flex-row items-baseline justify-between space-x-4 md:justify-end xl:text-2xl"
    >
      {#if $editing}
        <button
          type="submit"
          class="rounded border-2 border-stone-500 px-2 py-1 lg:px-6 lg:py-2"
          on:click={() => editing.set(false)}
        >
          Cancel
        </button>
        <form method="post" action="?/delete" use:enhance>
          <input type="hidden" name="id" value={formula.id} />
          <button
            type="submit"
            class="rounded border-2 border-stone-500 px-2 py-1 lg:px-6 lg:py-2"
          >
            Delete
          </button>
        </form>
        <form
          method="post"
          action="?/update"
          class=""
          use:enhance={handleEnhance}
        >
          <input type="hidden" name="id" value={$editedFormula.id} />
          <input type="hidden" name="fullData" bind:value={$jsonFullData} />
          <button
            type="submit"
            class="rounded border-2 border-stone-500 px-2 py-1 lg:px-6 lg:py-2"
          >
            Save
          </button>
        </form>
      {:else}
        <Label>Showing</Label>
        <select
          class="col-start-1 row-start-1 rounded border-2 border-stone-500 bg-transparent px-4 py-1 ring-0 focus:border-stone-500 focus:ring-0 lg:px-8 lg:py-2 xl:text-2xl dark:bg-stone-800"
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
        <button
          on:click={() => editing.set(!$editing)}
          class="rounded border-2 border-stone-500 px-2 py-1 lg:px-6 lg:py-2"
        >
          Edit
        </button>
      {/if}
    </div>
  </div>

  <div
    id="center"
    class="mb-12 grid w-full grid-cols-1 items-baseline gap-4 gap-x-8 py-4 md:grid-cols-2 md:grid-rows-5"
  >
    {#each $editedFormula.ingredients as ingredient, i}
      <div class="flex flex-row justify-between">
        <div id="left-part" class="flex flex-col tracking-tight">
          <VariableLabel
            text={ingredient.volatility}
            bind:value={ingredient.volatility}
          />
          {#if $editing}
            <input
              type="text"
              bind:value={ingredient.common_name}
              placeholder={ingredient.common_name}
              class="rounded border-none border-stone-500 bg-transparent p-0 font-medium ring-0 focus:border-stone-500 focus:ring-0
  xl:text-2xl dark:bg-stone-800
  "
            />
          {:else}
            <a
              href="/collect/{ingredient.counterpart}"
              class="font-medium transition-colors hover:text-aqua-700 xl:text-2xl"
            >
              {ingredient.common_name}
            </a>
          {/if}
        </div>

        <div id="right-part" class="grid w-36 grid-cols-2 text-right">
          <VariableNumericInput
            number={ingredient.amount * multiplier}
            bind:value={ingredient.amount}
            class="mt-auto flex-shrink-0"
          />
          <VariableNumericInput
            number={ingredient.percentage}
            bind:value={ingredient.percentage}
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
    {/each}
    {#if $editing}
      <button
        class="items-center justify-center rounded border-2 border-stone-500 py-2 text-center font-bold md:col-span-2 xl:border-4"
        on:click|preventDefault={addIngredient}
      >
        Add Ingredient
      </button>
    {/if}
  </div>

  <div
    id="footer"
    class="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8"
  >
    <div>
      <Label>description</Label>
      <VariableTextarea
        text={formula.description}
        bind:value={$editedFormula.description}
        class="font-medium xl:text-2xl"
      />
    </div>
    <div>
      <Label>notes</Label>
      <VariableTextarea
        text={formula.notes}
        bind:value={$editedFormula.notes}
        class="font-medium xl:text-2xl"
      />
    </div>
  </div>
</AppWrap>
