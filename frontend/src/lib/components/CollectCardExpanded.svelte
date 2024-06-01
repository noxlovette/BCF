<script lang="ts">
import Suggestion from '$lib/icons/Suggestion.svelte';
import CancelButton from '$lib/icons/CancelButton.svelte';
import { deleteFromCollection, saveEditedIngredientCollect, createCustomIngredientCollect, fetchCollection } from '$lib/DjangoAPI';
import DeleteIcon from '$lib/icons/DeleteIcon.svelte';
import OkIcon from '$lib/icons/OkIcon.svelte';
import { notification } from '$lib/stores/notificationStore';


export let filteredCollection = [];
export let chosenIngredient:any = null;
export let ingredient: any = {};
export let collection = [];
export let editedIngredient = null;

async function handleFetch(forceReload = false) {
    const data = await fetchCollection({ forceReload: forceReload });
    return data;
  }

// delete ingredient, custom or otherwise
     /**
     * @param {MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }} ingredient
     */
     async function handleDeleteClick(ingredient) {
        const response = await deleteFromCollection(ingredient);
        try {
        filteredCollection = filteredCollection.filter(ingredientInside => ingredientInside.id !== ingredient.id);
        chosenIngredient = null;
        notification.set({message: response, type: "success"});
      } catch(error) {
        notification.set({message:error, type:"error"});
      }
}

     /**
     * @param {{object: any;}} ingredient
     */
function toggleEdit(ingredient) {
    editedIngredient = editedIngredient === ingredient ? null : ingredient;
  }
   
async function saveEdit(ingredientToSave) {
    if (!ingredientToSave) return;
    else if (ingredientToSave.id === null) {
        handleCreateCustomIngredient(ingredientToSave);
        return;
    }
  try {
    const response = await saveEditedIngredientCollect(ingredientToSave);
    toggleEdit(ingredientToSave);
    collection = await handleFetch(true);
    notification.set({message:"Saved edit", type:"success"});
  } catch (error) {
    notification.set({message:"Something went wrong", type:"error"});
  }
}

async function handleCreateCustomIngredient(newCustom) {
    newCustom.unit = 'g';
    try {
        const response = await createCustomIngredientCollect(newCustom);
        notification.set({message:"Ingredient created", type:"success"});
        collection = await handleFetch(true);
    } catch (error) {
        notification.set({message:"Something went wrong", type:"error"});
    }
  }

    </script>

{#if ingredient !== null}
<button id="card-big" class="flex flex-col p-8  rounded-lg shadow-lg bg-white dark:bg-stone-800 h-[600px] w-[360px] sm:w-[475px] md:h-[475px] md:w-[768px] transition-all border-rose-950 z-50 text-left cursor-default select-text selection:bg-rose-300/40 caret-rose-700" 

on:mousedown|stopPropagation>
    <div id="top-part" class="flex flex-row items-baseline border-b w-full">
        <div id="top-left" class="flex flex-col items-start border-0 sm:border-r w-2/3 pr-4 pb-2">
            <h1 class="flex w-full text-4xl tracking-tighter font-bold text-rose-800 mr-8 mb-2">
                {#if !editedIngredient || editedIngredient.type === "CollectionIngredient"}
                    {ingredient.common_name}
                {:else}
                    <input type="text" class="w-full p-0 text-4xl tracking-tighter font-bold text-rose-800 focus:ring-0 border-none ring-0 dark:bg-stone-800" bind:value={editedIngredient.common_name} placeholder="name" />
                {/if}
                </h1>
            <h2 class="text-sm opacity-60 lowercase w-full hidden sm:block">
                added {ingredient.date_added}
            </h2>
        </div>
        <div id="top-right" class="sm:flex flex-1 flex-col items-start pl-4 hidden">
            {#if !editedIngredient || editedIngredient.type === "CollectionIngredient"}
            <h2 class="text-2xl opacity-60 min-w-fit mb-2">{ingredient.cas}</h2>
            {:else}
            <input type="text" class="w-full p-0 text-2xl opacity-60 focus:ring-0 border-none ring-0 dark:bg-stone-800" bind:value={editedIngredient.cas} placeholder="cas" />
            {/if}
            <h2 class="text-sm opacity-60 hidden md:block">
                {#if !editedIngredient || editedIngredient.type === "CollectionIngredient"}
                    {#if ingredient.volalitliy}
                        {ingredient.volatility}
                    {:else}
                        volatile
                {/if}
                {:else}
                    <input type="text" class="w-full p-0 text-sm focus:ring-0 border-none ring-0 dark:bg-stone-800" bind:value={editedIngredient.volalitliy} placeholder="volalitliy" />
                {/if}
            </h2>
        </div>
    </div>
    <div id="bottom-part" class="flex flex-row size-full">

    <div id="bottom-left" class="flex flex-col border-r w-2/3">
        <h3 class="mr-8 mt-8 text-sm opacity-60">
            how to use it
        </h3>
    <p class="mr-8 normal-case">
        
        {#if !editedIngredient || editedIngredient.type === "CollectionIngredient"}
        {#if ingredient.use}  
            {ingredient.use}
        {:else}
        Do you know how to use this ingredient? Submit a suggestion on the <a href="/browse" class="hover:underline"> browse page! </a>
        {/if}
        {:else}
            <textarea class="w-full p-0 focus:ring-0 border-none ring-0 dark:bg-stone-800" bind:value={editedIngredient.use} placeholder="how to use this ingredient?" />
        {/if}
    </p>
    <h3 class="text-sm mr-8 mt-8 opacity-60">
        my impression
    </h3>
    <p class="mr-8 normal-case">
        
        {#if !editedIngredient}
        {#if ingredient.impression}  
            {ingredient.impression}
        {:else}
        Time to record your impression!
        {/if}
        {:else}
            <textarea class="w-full p-0 focus:ring-0 border-none ring-0 dark:bg-stone-800" bind:value={editedIngredient.impression} placeholder="what do you think about it?" />
        {/if}
    </p>
    <div class="flex flex-col items-start mt-auto">
    <h3 class="text-sm opacity-60">
        associations
    </h3>
    <p class="w-full">
        {#if !editedIngredient}
        {#if ingredient.associations}
            {ingredient.associations}
        {:else}
            none for now
        {/if}
        {:else}
            <textarea class="w-full p-0 focus:ring-0 border-none ring-0 dark:bg-stone-800" bind:value={editedIngredient.associations} placeholder="makes me think of..." />
        {/if}
    </p>
</div>
</div>

<div id="bottom-right" class="flex flex-1 flex-col px-4 pt-4 normal-case">
    <ul class="space-y-8 mt-4">
        <li class="flex flex-col items-start">
            <h3 class="text-sm opacity-60">
                amount
            </h3>
    <p>
        {#if !editedIngredient}
            {#if ingredient.amount}
                {ingredient.amount} {ingredient.unit}
            {:else}
                0
            {/if}
        {:else}
            <input type="number" class="w-full p-0 text-sm focus:ring-0 border-none ring-0 dark:bg-stone-800" bind:value={editedIngredient.amount} placeholder="amount" />
        {/if}
    </p>

</li>
<li class="flex flex-col items-start">
    <h3 class="text-sm opacity-60">
        colour
    </h3>

    <p>
        {#if !editedIngredient}

        {#if ingredient.colour}
        {ingredient.colour}
        {:else}
        colour
        {/if}
        {:else}
        <input type="text" class="w-full p-0 text-sm focus:ring-0 border-none ring-0 dark:bg-stone-800" bind:value={editedIngredient.colour} placeholder="colour" />
        {/if}
    </p>
</li>
<li class="flex flex-col items-start">
    <h3 class="text-sm opacity-60">
        ideas
    </h3>
    <p>
        {#if !editedIngredient}
        {#if ingredient.ideas}
            {ingredient.ideas}
        {:else}
            ideas
        {/if}
        {:else}
        <input type="text" class="w-full p-0 text-sm focus:ring-0 border-none ring-0 dark:bg-stone-800" bind:value={editedIngredient.ideas} placeholder="ideas" />
        {/if}
    </p>
</li>
    </ul>
    <div class="flex flex-row space-x-2 mt-auto group opacity-60 hover:opacity-100 transition-all">
        {#if !editedIngredient}
        <button class='hover:bg-rose-700 hover:text-rose-50 group-hover:p-2 rounded-full transition-all  ' title="add the ingredient to your collection
        "
        on:mousedown={() => handleDeleteClick(ingredient)}
        >
        <DeleteIcon />
    </button>
    <button class='hover:bg-rose-700 hover:text-rose-50 group-hover:p-2 rounded-full transition-all ' title="suggest a change"
    on:mousedown={() => toggleEdit(ingredient)}>
        <Suggestion />
    </button>
    {:else}
    <button class='hover:bg-rose-700 hover:text-rose-50 group-hover:p-2 rounded-full transition-all ' title="submit your suggestion"
    on:mousedown={() => 
    
    
    saveEdit(editedIngredient)}>
        <OkIcon />
    </button>
    {#if editedIngredient.id !== null}
    <button class='hover:bg-rose-700 hover:text-rose-50 group-hover:p-2 rounded-full transition-all ' title="cancel your suggestion"
    on:mousedown={() => toggleEdit(ingredient)}>
        <CancelButton />
    </button>
    {/if}

    {/if}
    </div>
</div>  
</div>
</button>
{/if}
