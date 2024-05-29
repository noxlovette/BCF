<script lang="ts">
import Add from "../icons/Add.svelte";
import {onMount } from "svelte";
import { writable } from "svelte/store";
import { addToCollectionBrowse } from "$lib/DjangoAPI";

    let is_authenticated = null;
    export let notification = writable("");
    export let ingredient: any = {};
    export let chosenIngredient:any = null;
    let buttonError = false;
    let buttonSuccess = false;

    onMount(async () => {
        is_authenticated = sessionStorage.getItem("is_authenticated");
    });

async function handleAddIngredient(ingredientId:number) {

  if (is_authenticated !== null) {
    try {
      const response = await addToCollectionBrowse(ingredientId);
        if (response === "ingredient is already in collection") {
            buttonError = true;
            notification.set("Ingredient already in collection");
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
    notification.set("You need to be logged in to add ingredients to your collection");
  }
}

$: if (buttonSuccess || buttonError) {
    setTimeout(() => {
      buttonSuccess = false;
      buttonError = false;
    }, 100);
  }

</script>


<button id="card-small" class="p-8 rounded-lg shadow-md bg-white dark:bg-gray-800 min-h-[160px] transition-all group hover:scale-105 hover:text-sky-50 hover:bg-sky-800 hover:shadow-lg text-left"
on:mousedown={() => chosenIngredient = ingredient}
tabindex="0"
>
    <div id="top-part" class="flex flex-row items-baseline">
        <h1 id="top-left" class="text-3xl tracking-tighter font-bold truncate text-sky-800 mr-8 group-hover:text-sky-50">{ingredient.common_name}</h1>
        <h2 id="top-right" class="ml-auto text-clip opacity-60 min-w-fit group-hover:text-sky-200/60">{ingredient.cas}</h2>
    </div>
    <div id="bottom-part" class="flex flex-row mt-4">
        <div id="bottom-left" class="flex flex-col w-2/3 mr-auto">
            <p class="text-clip mr-8 text-left normal-case h-[100px]">
                {#if ingredient.use}    
                    {ingredient.use}
                {:else}
                    Know how to use this? Submit a suggestion!
                {/if}
            </p>
           <h2 class="opacity-60 group-hover:text-sky-200/60 justify-start lowercase">{ingredient.descriptors}</h2>
        </div>
        <div id="bottom-right" class="flex flex-1 flex-col ml-auto mt-auto items-end">
            <button class="items-baseline invisible group-hover:visible rounded-full hover:transition-all hover:bg-sky-50 hover:text-sky-700 p-2 
            {buttonError ? 'hover:bg-rose-500' : buttonSuccess ? 'hover:bg-lime-500' : ''}" 
            on:mousedown={() => handleAddIngredient(ingredient.id)} on:mousedown|stopPropagation>
                <Add />
            </button>
        </div>
    </div>
</button>
