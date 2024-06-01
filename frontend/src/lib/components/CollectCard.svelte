<script lang="ts">
import DeleteIcon from "$lib/icons/DeleteIcon.svelte";
import { deleteFromCollection } from "$lib/DjangoAPI";
import {onMount } from "svelte";
import { notification } from '$lib/stores/notificationStore';


    let is_authenticated = null;
    export let ingredient: any = {};
    export let chosenIngredient:any = null;
    export let filteredCollection = [];

    onMount(async () => {
        is_authenticated = sessionStorage.getItem("is_authenticated");
    });

    // delete ingredient, custom or otherwise
     /**
     * @param {MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }} ingredient
     */
     async function handleDeleteClick(ingredient) {
        const response = await deleteFromCollection(ingredient);

        try {
        filteredCollection = filteredCollection.filter(ingredientInside => ingredientInside.id !== ingredient.id);
        notification.set({message:response, type:"success"});
      } catch(error) {

        notification.set({message: error, type: "error"});
      }
}


</script>


<button id="card-small" class="p-8 rounded-lg shadow-md bg-white dark:bg-stone-800 min-h-[160px] transition-all group hover:scale-105 hover:text-rose-50 hover:bg-rose-800 hover:shadow-lg text-left"
on:mousedown={() => chosenIngredient = ingredient}
tabindex="0"
>
    <div id="top-part" class="flex flex-row items-baseline">
        <h1 id="top-left" class="text-3xl tracking-tighter font-bold truncate text-rose-800 mr-8 group-hover:text-rose-50">{ingredient.common_name}</h1>
        <h2 id="top-right" class="ml-auto text-clip opacity-60 min-w-fit group-hover:text-rose-200/60">{ingredient.cas}</h2>
    </div>
    <div id="bottom-part" class="flex flex-row mt-4">
        <div id="bottom-left" class="flex flex-col w-2/3 mr-auto">
            <p class="text-clip mr-8 text-left normal-case h-[100px]">
                {#if ingredient.impression}    
                    {ingredient.impression}
                {:else}
                    Time to record your impression!
                {/if}
            </p>
           <h2 class="opacity-60 group-hover:text-rose-200/60 justify-start lowercase">
            {#if ingredient.colour}
            {ingredient.colour}
            {:else}
            colour
            {/if}
          
          </h2>
        </div>
        <div id="bottom-right" class="flex flex-1 flex-col ml-auto mt-auto items-end">
            <button class="items-baseline invisible group-hover:visible rounded-full hover:transition-all hover:bg-rose-50 hover:text-rose-700 p-2 " 
            on:mousedown={() => handleDeleteClick(ingredient)} on:mousedown|stopPropagation>
                <DeleteIcon />
            </button>
        </div>
    </div>
</button>
