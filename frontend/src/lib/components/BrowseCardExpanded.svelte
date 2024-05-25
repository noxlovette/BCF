<script lang="ts">
import Add from '$lib/components/svg/Add.svelte';
import Suggestion from '$lib/components/svg/Suggestion.svelte';
import { writable } from 'svelte/store';

export let ingredient: any = {};
export let notification = writable("");
export let is_authenticated = false;
let showSuggestion = false;
let suggestedIngredient = null;


function toggleSuggestion(ingredient) {
  if (is_authenticated === null) {
    notification.set("you need to be logged in to suggest changes");
    return;
  } else {
    showSuggestion = !showSuggestion;
    notification.set("time to tell the world what you know!");
    suggestedIngredient = suggestedIngredient === ingredient ? null : ingredient;
  }
}
let message = null;
async function submitSuggestion() {
  let body = { 
  message: message,
  ingredient: suggestedIngredient.id,
  common_name: suggestedIngredient.common_name,
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
  showSuggestion = false;
  message = null;
}








    </script>

{#if ingredient !== null}
<button id="card-big" class="p-8 rounded-lg shadow-lg bg-white min-h-[400px] min-w-[600px] transition-all border-sky-950 z-50 text-left cursor-default select-text selection:bg-sky-300/40" 

on:mousedown|stopPropagation>
    <div id="top-part" class="flex flex-row items-baseline border-b">
        <div id="top-left" class="flex flex-col items-start border-r w-2/3 pr-4 py-2 truncate">
            <h1 class="text-4xl tracking-tighter font-bold truncate text-sky-800 mr-8 mb-2">{ingredient.common_name}</h1>
            <h2 class="text-sm opacity-60 lowercase">{ingredient.descriptors}</h2>
        </div>
        <div id="top-right" class="flex flex-1 flex-col items-start pl-4 py-2">
            <h2 class="text-2xl opacity-60 min-w-fit mb-2">{ingredient.cas}</h2>
            {#if ingredient.volalitliy}
            <h2 class="text-sm opacity-60">{ingredient.volatility}</h2>
            {:else}
            <h2 class="text-sm opacity-60 ">volatile</h2>
            {/if}
        </div>
    </div>
    <div id="bottom-part" class="flex flex-row">

    <div id="bottom-left" class="flex flex-col border-r w-2/3">
    <p class="mr-8 mt-8 normal-case">
        {#if ingredient.use}  
        {ingredient.use}
        {:else}
        Do you know how to use this ingredient? Submit a suggestion!
        {/if}
    </p>
<div class="flex flex-col items-start mt-[200px]">
    <h3 class="text-sm opacity-60">
        similar ingredients
    </h3>
    <p class="">
        {#if Array.isArray(ingredient.similar_ingredients) && ingredient.similar_ingredients.length > 0}
    {ingredient.similar_ingredients}
{:else}
    none for now
{/if}

    </p>
</div>
</div>

<div id="bottom-right" class="flex flex-1 flex-col p-4 normal-case">
    <ul class="space-y-8 mt-4">
        <li class="flex flex-col items-start">
            <h3 class="text-sm opacity-60">
                origin
            </h3>
    <p>
        {ingredient.origin}
    </p>

</li>
<li class="flex flex-col items-start">
    <h3 class="text-sm opacity-60">
        IFRA
    </h3>

    <p>
        {ingredient.is_restricted}
    </p>
</li>
<li class="flex flex-col items-start">
    <h3 class="text-sm opacity-60">
        contributors
    </h3>

    <p>
        {#if Array.isArray(ingredient.contributors) && ingredient.contributors.length > 0}
        {ingredient.contributors}
        {:else}
        IFRA, Danila Volkov
        {/if}
    </p>
</li>
    </ul>
    <div class="flex flex-row space-x-2 mt-[45px]">
        <button>
        <Add />
    </button>
    <button>
        <Suggestion />
    </button>
    </div>
</div>  
</div>
</button>
{/if}