<script lang="ts">
  import Add from "$lib/icons/Add.svelte";
  import Suggestion from "$lib/icons/Suggestion.svelte";
  import { addSuggestionBrowse, addToCollectionBrowse } from "$lib/DjangoAPI";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  let is_authenticated = null;
  export let showSuggestion = false;
  export let suggestedIngredient = null;
  let message = null;

  export let data: PageData;

  const ingredient: App.IngredientBrowse = data.ingredient;

  import { notification } from "$lib/stores/notificationStore";

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

<div class="flex size-full flex-row">
  <div id="top-part" class="flex w-full flex-row items-baseline border-b">
    <div
      id="top-left"
      class="flex w-2/3 flex-col items-start border-0 pb-2 pr-4 sm:border-r"
    >
      <h1
        class="mb-2 mr-8 flex w-full text-4xl font-bold tracking-tighter text-navy-800"
      >
        {ingredient.common_name}
      </h1>
      <h2 class="w-full text-sm lowercase opacity-60">
        {ingredient.descriptors}
      </h2>
    </div>
    <div id="top-right" class="hidden flex-1 flex-col items-start pl-4 sm:flex">
      <h2 class="mb-2 min-w-fit text-2xl opacity-60">{ingredient.cas}</h2>
      <h2 class="text-sm opacity-60">
        {#if ingredient.volalitliy}
          {ingredient.volatility}
        {:else}
          volatile
        {/if}
      </h2>
    </div>
  </div>
  <div id="bottom-part" class="flex size-full flex-row">
    <div id="bottom-left" class="flex w-2/3 flex-col border-r">
      <p class="mr-8 mt-8 normal-case">
        {#if ingredient.use}
          {ingredient.use}
        {:else}
          Do you know how to use this ingredient? Submit a suggestion!
        {/if}
      </p>
      <div class="mt-auto flex flex-col items-start">
        <h3 class="text-sm opacity-60">similar ingredients</h3>
        <p class="w-full">
          {#if Array.isArray(ingredient.similar_ingredients) && ingredient.similar_ingredients.length > 0}
            {ingredient.similar_ingredients}
          {:else}
            none for now
          {/if}
        </p>
      </div>
    </div>

    <div id="bottom-right" class="flex flex-1 flex-col px-4 pt-4 normal-case">
      <ul class="mt-4 space-y-8">
        <li class="flex flex-col items-start">
          <h3 class="text-sm opacity-60">origin</h3>
          <p>
            {#if ingredient.origin}
              {ingredient.origin}
            {:else}
              unknown
            {/if}
          </p>
        </li>
        <li class="flex flex-col items-start">
          <h3 class="text-sm opacity-60">IFRA</h3>

          <p>
            {#if ingredient.is_restricted === "true"}
              restricted
            {:else}
              not restricted
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
      </div>
    </div>
  </div>
</div>
