<script lang="ts">
  import Add from "$lib/icons/Add.svelte";
  import Suggestion from "$lib/icons/Suggestion.svelte";
  import { addSuggestionBrowse, addToCollectionBrowse } from "$lib/DjangoAPI";
  import { onMount } from "svelte";
  import CancelButton from "$lib/icons/CancelButton.svelte";
  import SaveButton from "$lib/icons/SaveButton.svelte";
  export let ingredient: any = {};
  let is_authenticated = null;
  export let showSuggestion = false;
  export let suggestedIngredient = null;
  let message = null;

  import { notification } from "$lib/stores";

  onMount(async () => {
    is_authenticated = sessionStorage.getItem("is_authenticated");
  });

  function toggleSuggestion(ingredient) {
    if (is_authenticated === null) {
      notification.set({
        message: "you need to be logged in to suggest changes",
        type: "error",
      });
      return;
    } else {
      showSuggestion = !showSuggestion;
      notification.set({
        message: "time to tell the world what you know!",
        type: "success",
      });
      suggestedIngredient =
        suggestedIngredient === ingredient ? null : ingredient;
    }
  }

  async function handleAddIngredient(ingredientId: number) {
    if (is_authenticated !== null) {
      try {
        const response = await addToCollectionBrowse(ingredientId);
        if (response === "ingredient is already in collection") {
          notification.set({
            message: "Ingredient already in collection",
            type: "error",
          });

          return;
        }

        notification.set(response);
      } catch (error) {
        console.error("Failed to add ingredient to collection");
        notification.set({
          message: "Failed to add ingredient to collection",
          type: "error",
        });
      }
    } else {
      notification.set({
        message:
          "You need to be logged in to add ingredients to your collection",
        type: "error",
      });
    }
  }

  async function submitSuggestion() {
    if (is_authenticated !== null) {
      try {
        let body = {
          message: message,
          ingredient: suggestedIngredient.id,
          common_name: suggestedIngredient.common_name,
          other_names: suggestedIngredient.other_names,
          cas: suggestedIngredient.cas,
          volatility: suggestedIngredient.volatility,
          ingredient_type: suggestedIngredient.ingredient_type,
          use: suggestedIngredient.use,
          origin: suggestedIngredient.origin,
          constituents: suggestedIngredient.constituents
            ? JSON.stringify(suggestedIngredient.constituents)
            : null,
          similar_ingredients: suggestedIngredient.similar_ingredients
            ? JSON.stringify(suggestedIngredient.similar_ingredients)
            : null,
          is_restricted: suggestedIngredient.is_restricted,
        };
        const response = await addSuggestionBrowse(body);

        notification.set({
          message: "Thank you for making BCF better!",
          type: "success",
        });
        showSuggestion = false;
        suggestedIngredient = null;
        message = null;
      } catch (error) {
        notification.set({
          message: "Failed to submit suggestion",
          type: "error",
        });
      }
    } else {
      notification.set({
        message: "You need to be logged in to suggest changes",
        type: "error",
      });
    }
  }
</script>

{#if ingredient !== null}
  <button
    id="card-big"
    class="relative z-50 flex h-[600px] w-[360px] cursor-default select-text flex-col rounded-lg border-navy-950 bg-white p-8 text-left caret-navy-700 shadow-lg transition-all selection:bg-navy-300/40 sm:w-[475px] md:h-[475px] md:w-[768px] dark:bg-stone-800"
    on:mousedown|stopPropagation
  >
    <button
      class="absolute right-2 top-2"
      on:mousedown={() => (ingredient = null)}
    >
      <CancelButton />
    </button>
    <div id="top-part" class="flex w-full flex-row items-baseline border-b">
      <div
        id="top-left"
        class="flex w-2/3 flex-col items-start border-0 pb-2 pr-4 sm:border-r"
      >
        <h1
          class="mb-2 mr-8 flex w-full text-4xl font-bold tracking-tighter text-navy-800"
        >
          {#if !showSuggestion}
            {ingredient.common_name}
          {:else}
            <input
              type="text"
              class="w-full border-none p-0 text-4xl font-bold tracking-tighter text-navy-800 ring-0 focus:ring-0 dark:bg-stone-800"
              bind:value={suggestedIngredient.common_name}
              placeholder="names"
            />
          {/if}
        </h1>
        <h2 class="w-full text-sm lowercase opacity-60">
          {#if !showSuggestion}
            {ingredient.descriptors}
          {:else}
            <textarea
              class="w-full border-none p-0 text-sm ring-0 focus:ring-0 dark:bg-stone-800"
              bind:value={suggestedIngredient.other_names}
              placeholder="other names"
            />
          {/if}
        </h2>
      </div>
      <div
        id="top-right"
        class="hidden flex-1 flex-col items-start pl-4 sm:flex"
      >
        <h2 class="mb-2 min-w-fit text-2xl opacity-60">{ingredient.cas}</h2>
        <h2 class="text-sm opacity-60">
          {#if !showSuggestion}
            {#if ingredient.volalitliy}
              {ingredient.volatility}
            {:else}
              volatile
            {/if}
          {:else}
            <input
              type="text"
              class="w-full border-none p-0 text-sm ring-0 focus:ring-0 dark:bg-stone-800"
              bind:value={suggestedIngredient.volalitliy}
              placeholder="volalitliy"
            />
          {/if}
        </h2>
      </div>
    </div>
    <div id="bottom-part" class="flex size-full flex-row">
      <div id="bottom-left" class="flex w-2/3 flex-col border-r">
        <p class="mr-8 mt-8 normal-case">
          {#if !showSuggestion}
            {#if ingredient.use}
              {ingredient.use}
            {:else}
              Do you know how to use this ingredient? Submit a suggestion!
            {/if}
          {:else}
            <textarea
              class="w-full border-none p-0 ring-0 focus:ring-0 dark:bg-stone-800"
              bind:value={suggestedIngredient.use}
              placeholder="how to use this ingredient?"
            />
          {/if}
        </p>
        <div class="mt-auto flex flex-col items-start">
          <h3 class="text-sm opacity-60">similar ingredients</h3>
          <p class="w-full">
            {#if !showSuggestion}
              {#if Array.isArray(ingredient.similar_ingredients) && ingredient.similar_ingredients.length > 0}
                {ingredient.similar_ingredients}
              {:else}
                none for now
              {/if}
            {:else}
              <textarea
                class="w-full border-none p-0 ring-0 focus:ring-0 dark:bg-stone-800"
                bind:value={suggestedIngredient.similar_ingredients}
                placeholder="similar ingredients"
              />
            {/if}
          </p>
        </div>
      </div>

      <div id="bottom-right" class="flex flex-1 flex-col px-4 pt-4 normal-case">
        <ul class="mt-4 space-y-8">
          <li class="flex flex-col items-start">
            <h3 class="text-sm opacity-60">origin</h3>
            <p>
              {#if !showSuggestion}
                {#if ingredient.origin}
                  {ingredient.origin}
                {:else}
                  unknown
                {/if}
              {:else}
                <input
                  type="text"
                  class="w-full border-none p-0 text-sm ring-0 focus:ring-0 dark:bg-stone-800"
                  bind:value={suggestedIngredient.origin}
                  placeholder="origin"
                />
              {/if}
            </p>
          </li>
          <li class="flex flex-col items-start">
            <h3 class="text-sm opacity-60">IFRA</h3>

            <p>
              {#if !showSuggestion}
                {#if ingredient.is_restricted === "true"}
                  restricted
                {:else}
                  not restricted
                {/if}
              {:else}
                <input
                  type="text"
                  class="w-full border-none p-0 text-sm ring-0 focus:ring-0 dark:bg-stone-800"
                  bind:value={suggestedIngredient.is_restricted}
                  placeholder="restricted?"
                />
              {/if}
            </p>
          </li>
          <li class="hidden flex-col items-start sm:flex">
            <h3 class="text-sm opacity-60">contributors</h3>
            <p>
              {#if !showSuggestion}
                {#if Array.isArray(ingredient.contributors) && ingredient.contributors.length > 0}
                  {ingredient.contributors}
                {:else}
                  IFRA, Danila Volkov
                {/if}
              {:else}
                you!
              {/if}
            </p>
          </li>
        </ul>
        <div
          class="group mt-auto flex flex-row space-x-2 opacity-60 transition-all hover:opacity-100"
        >
          {#if !showSuggestion}
            <button
              class="rounded-full transition-all hover:bg-navy-700 hover:text-navy-50 group-hover:p-2"
              title="add the ingredient to your collection
        "
              on:mousedown={() => handleAddIngredient(ingredient.id)}
            >
              <Add />
            </button>
            <button
              class="rounded-full transition-all hover:bg-navy-700 hover:text-navy-50 group-hover:p-2"
              title="suggest a change"
              on:mousedown={() => toggleSuggestion(ingredient)}
            >
              <Suggestion />
            </button>
          {:else}
            <button
              class="rounded-full transition-all hover:bg-navy-700 hover:text-navy-50 group-hover:p-2"
              title="submit your suggestion"
              on:mousedown={() => submitSuggestion()}
            >
              <SaveButton />
            </button>
            <button
              class="rounded-full transition-all hover:bg-navy-700 hover:text-navy-50 group-hover:p-2"
              title="cancel your suggestion"
              on:mousedown={() => toggleSuggestion(ingredient)}
            >
              <CancelButton />
            </button>
          {/if}
        </div>
      </div>
    </div>
  </button>
{/if}
