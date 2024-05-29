<script lang="ts">
import Add from '$lib/icons/Add.svelte';
import Suggestion from '$lib/icons/Suggestion.svelte';
import { addSuggestionBrowse, addToCollectionBrowse } from '$lib/DjangoAPI';
import { writable } from 'svelte/store';
import { onMount } from 'svelte';
    import CancelButton from '$lib/icons/CancelButton.svelte';
    import SaveButton from '$lib/icons/SaveButton.svelte';

export let ingredient: any = {};
export let notification = writable("");
let is_authenticated = null;
export let showSuggestion = false;
export let suggestedIngredient = null;

let buttonError = false;
let buttonSuccess = false;

let message = null;

onMount(async () => {
        is_authenticated = sessionStorage.getItem("is_authenticated");
    });

function toggleSuggestion(ingredient) {
  if (is_authenticated === null) {
    notification.set("you need to be logged in to suggest changes");
    buttonError = true;
    return;
  } else {
    showSuggestion = !showSuggestion;
    notification.set("time to tell the world what you know!");
    suggestedIngredient = suggestedIngredient === ingredient ? null : ingredient;
  }
}

async function handleAddIngredient(ingredientId:number) {

if (is_authenticated !== null) {
  try {
    const response = await addToCollectionBrowse(ingredientId);
    if (response === "ingredient is already in collection") {
      notification.set("Ingredient already in collection");
      buttonError = true;
      return;
    }
    buttonSuccess = true;
    notification.set(response);
  } catch (error) {
    buttonError = true;
    console.error("Failed to add ingredient to collection");
    notification.set("Failed to add ingredient to collection");
}
} else {
    buttonError = true;
    console.log(buttonError, buttonSuccess)
  notification.set("You need to be logged in to add ingredients to your collection");
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
  constituents: suggestedIngredient.constituents ? JSON.stringify(suggestedIngredient.constituents) : null,
  similar_ingredients: suggestedIngredient.similar_ingredients ? JSON.stringify(suggestedIngredient.similar_ingredients) : null,
  is_restricted: suggestedIngredient.is_restricted,
};
  const response = await addSuggestionBrowse(body);
  buttonSuccess = true;
  notification.set("Thank you for making BCF better!");
    showSuggestion = false;
  suggestedIngredient = null;
  message = null;
    } catch (error) {
        buttonError = true;
        console.error("Failed to submit suggestion");
        notification.set("Failed to submit suggestion");
    }
} else {
    buttonError = true;
    console.log(buttonError, buttonSuccess);
    notification.set("You need to be logged in to suggest changes");
    }    
}

$: if (buttonSuccess || buttonError) {
    setTimeout(() => {
      buttonSuccess = false;
      buttonError = false;
    }, 100);
  }

    </script>

{#if ingredient !== null}
<button id="card-big" class="flex flex-col p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800 h-[275] w-[475px] md:h-[475px] md:w-[768px] transition-all border-sky-950 z-50 text-left cursor-default select-text selection:bg-sky-300/40 caret-sky-700" 

on:mousedown|stopPropagation>
    <div id="top-part" class="flex flex-row items-baseline border-b w-full">
        <div id="top-left" class="flex flex-col items-start border-r w-2/3 pr-4 pb-2">
            <h1 class="flex w-full text-4xl tracking-tighter font-bold text-sky-800 mr-8 mb-2">
                {#if !showSuggestion}
                    {ingredient.common_name}
                {:else}
                    <input type="text" class="w-full p-0 text-4xl tracking-tighter font-bold text-sky-800 focus:ring-0 border-none ring-0  dark:bg-gray-800" bind:value={suggestedIngredient.common_name} placeholder="names" />
                {/if}
                </h1>
            <h2 class="text-sm opacity-60 lowercase w-full">
                {#if !showSuggestion}
                    {ingredient.descriptors}
                {:else}
                    <textarea class="w-full p-0 text-sm focus:ring-0 border-none ring-0  dark:bg-gray-800" bind:value={suggestedIngredient.other_names} placeholder="other names" />
                {/if}
            </h2>
        </div>
        <div id="top-right" class="flex flex-1 flex-col items-start pl-4">
            <h2 class="text-2xl opacity-60 min-w-fit mb-2">{ingredient.cas}</h2>
            <h2 class="text-sm opacity-60">
                {#if !showSuggestion}
                    {#if ingredient.volalitliy}
                        {ingredient.volatility}
                    {:else}
                        volatile
                {/if}
                {:else}
                    <input type="text" class="w-full p-0 text-sm focus:ring-0 border-none ring-0 dark:bg-gray-800" bind:value={suggestedIngredient.volalitliy} placeholder="volalitliy" />
                {/if}
            </h2>
        </div>
    </div>
    <div id="bottom-part" class="flex flex-row size-full">

    <div id="bottom-left" class="flex flex-col border-r w-2/3">
    <p class="mr-8 mt-8 normal-case">
        {#if !showSuggestion}
        {#if ingredient.use}  
            {ingredient.use}
        {:else}
        Do you know how to use this ingredient? Submit a suggestion!
        {/if}
        {:else}
            <textarea class="w-full p-0 focus:ring-0 border-none ring-0 dark:bg-gray-800" bind:value={suggestedIngredient.use} placeholder="how to use this ingredient?" />
        {/if}
    </p>
    <div class="flex flex-col items-start mt-auto">
    <h3 class="text-sm opacity-60">
        similar ingredients
    </h3>
    <p class="w-full">
        {#if !showSuggestion}
        {#if Array.isArray(ingredient.similar_ingredients) && ingredient.similar_ingredients.length > 0}
            {ingredient.similar_ingredients}
        {:else}
            none for now
        {/if}
        {:else}
            <textarea class="w-full p-0 focus:ring-0 border-none ring-0 dark:bg-gray-800" bind:value={suggestedIngredient.similar_ingredients} placeholder="similar ingredients" />
        {/if}
    </p>
</div>
</div>

<div id="bottom-right" class="flex flex-1 flex-col px-4 pt-4 normal-case">
    <ul class="space-y-8 mt-4">
        <li class="flex flex-col items-start">
            <h3 class="text-sm opacity-60">
                origin
            </h3>
    <p>
        {#if !showSuggestion}
            {#if ingredient.origin}
                {ingredient.origin}
            {:else}
                unknown
            {/if}
        {:else}
            <input type="text" class="w-full p-0 text-sm focus:ring-0 border-none ring-0 dark:bg-gray-800" bind:value={suggestedIngredient.origin} placeholder="origin" />
        {/if}
    </p>

</li>
<li class="flex flex-col items-start">
    <h3 class="text-sm opacity-60">
        IFRA
    </h3>

    <p>
        {#if !showSuggestion}

        {#if ingredient.is_restricted === "true"}
        restricted
        {:else}
        not restricted
        {/if}
        {:else}
        <input type="text" class="w-full p-0 text-sm focus:ring-0 border-none ring-0 dark:bg-gray-800" bind:value={suggestedIngredient.is_restricted} placeholder="restricted?" />
        {/if}
    </p>
</li>
<li class="flex flex-col items-start">
    <h3 class="text-sm opacity-60">
        contributors
    </h3>
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
    <div class="flex flex-row space-x-2 mt-auto group opacity-60 hover:opacity-100 transition-all">
        {#if !showSuggestion}
        <button class='hover:bg-sky-700 hover:text-sky-50 group-hover:p-2 rounded-full transition-all {buttonError ? 'hover:bg-rose-500' : buttonSuccess ? 'hover:bg-lime-500' : ''} ' title="add the ingredient to your collection
        "
        on:mousedown={() => handleAddIngredient(ingredient.id)}
        >
        <Add />
    </button>
    <button class='hover:bg-sky-700 hover:text-sky-50 group-hover:p-2 rounded-full transition-all {buttonError ? 'hover:bg-rose-500' : buttonSuccess ? 'hover:bg-lime-500' : ''}' title="suggest a change"
    on:mousedown={() => toggleSuggestion(ingredient)}>
        <Suggestion />
    </button>
    {:else}
    <button class='hover:bg-sky-700 hover:text-sky-50 group-hover:p-2 rounded-full transition-all {buttonError ? 'hover:bg-rose-500' : buttonSuccess ? 'hover:bg-lime-500' : ''}' title="submit your suggestion"
    on:mousedown={() => submitSuggestion()}>
        <SaveButton />
    </button>
    <button class='hover:bg-sky-700 hover:text-sky-50 group-hover:p-2 rounded-full transition-all {buttonError ? 'hover:bg-rose-500' : buttonSuccess ? 'hover:bg-lime-500' : ''}' title="cancel your suggestion"
    on:mousedown={() => toggleSuggestion(ingredient)}>
        <CancelButton />
    </button>
    {/if}
    </div>
</div>  
</div>
</button>
{/if}
