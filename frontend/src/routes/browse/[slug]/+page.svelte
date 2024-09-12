<script lang="ts">
  import Add from "$lib/icons/Add.svelte";
  import Suggestion from "$lib/components/Suggestion.svelte";
  import SuggestionIcon from "$lib/icons/SuggestionIcon.svelte";
  import type { PageServerData, ActionData } from "./$types";
  export let showSuggestion = false;
  import { notification } from "$lib/stores";
  import RoundButton from "$lib/components/UI/RoundButton.svelte";
    import MetaData from "$lib/components/MetaData.svelte";
    import AppWrap from "$lib/components/AppWrap.svelte";
    import { enhance } from "$app/forms";
    
    import {user } from "$lib/stores";

  export let data: PageServerData;

  const ingredient: App.IngredientBrowse = data.ingredient;
  const unsplashData = data.photo;

  const href = `https://unsplash.com/@${unsplashData.user.username}?utm_source=bcf&utm_medium=referral`;

  let volatility = ingredient.volatility || 'unknown';
  let useMessage = ingredient.use || 'Do you know how to use this ingredient? Submit a suggestion!';
  let similarIngredients = Array.isArray(ingredient.similar_ingredients) && ingredient.similar_ingredients.length > 0
    ? ingredient.similar_ingredients
    : 'none for now';
  let origin = ingredient.origin || 'unknown';
  let otherNames = Array.isArray(ingredient.other_names) && ingredient.other_names.length > 0
    ? ingredient.other_names
    : 'none for now';
  let ifraStatus = ingredient.is_restricted === true ? 'restricted' : 'not restricted';
  let contributors = showSuggestion
    ? 'you!'
    : (Array.isArray(ingredient.contributors) && ingredient.contributors.length > 0)
    ? ingredient.contributors
    : 'IFRA, Danila Volkov';


    const description = `Discover ${ingredient.common_name}. ${ingredient.use}. Explore similar ingredients and fragrances at BCF.`;
    const keywords = `${ingredient.common_name}, ${ingredient.descriptors}, ${ingredient.other_names}, ${ingredient.cas}, ${ingredient.origin}, ${ingredient.volatility}, fragrance, BCF, ingredient, perfume, perfumery`;

</script>

<MetaData title="{ingredient.common_name}" description={description} keywords={keywords} ogUrl={`https://bcfapp.app/ingredient/${ingredient.slug}`} />

<AppWrap class="2xl:px-24 select-text caret-navy-800 selection:bg-navy-100 selection:text-navy-800">
  <div class=" rounded border-navy-800">
    <div id="top-part" class="flex flex-row items-center p-8 rounded bg-navy-700 text-navy-50 border-b border-navy-800">
      <div id="top-left" class="flex w-3/4 flex-col space-y-6 pr-24">
        <h1 class="flex w-full text-5xl font-bold tracking-tighter font-quicksand pb-4 border-b-2">
          {ingredient.common_name}
        </h1>
        <div>
        <h2 class="w-full lowercase"><span class="opacity-60">descriptors:</span> {ingredient.descriptors}</h2>
        <h3 class=" "><span class="opacity-60 ">other names:</span> {otherNames}</h3>
      </div>
      </div>
      <div id="top-right" class=" flex-1 flex-col flex">
        <h2 class="mb-2 min-w-fit text-2xl font-quicksand">{ingredient.cas}</h2>
        <h2 class="lowercase">{volatility} <span class="opacity-60">note</span></h2>
      </div>
      {#if $user.is_authenticated}
      <div class="flex space-x-2 items-center justify-center rounded flex-1">
      <form 
      method="post" action="?/add" use:enhance={() => notification.set({ message: 'Added to your collection', type: 'success' })}
      >
      <input type="hidden" name="id" value="{ingredient.id}" />
        <RoundButton>
          <Add />
        </RoundButton>
  
      </form>
        <RoundButton on:click={() => showSuggestion = !showSuggestion}>
          <SuggestionIcon />
        </RoundButton>
      </div>
      {/if}
    </div>
  
    <div id="bottom-part" class="flex flex-row py-4">
      <div id="bottom-left" class="flex-1 flex mr-8 flex-col border-2 rounded p-4 border-navy-700">
        <p class="opacity-60 text-navy-600 dark:text-navy-300">how to use</p>
        <p class="">{useMessage}</p>
        
        <ul class="flex flex-row mt-auto w-full justify-between">
          <li class="flex flex-col">
            <h3 class=" opacity-60 text-navy-600 dark:text-navy-300">similar ingredients</h3>
            <p class="w-full">{similarIngredients}</p>
          </li>
        </ul>

      </div>
  
      <div id="bottom-right" class="flex w-1/4 flex-col border-2 border-navy-700 p-4 rounded">
        <ul class="space-y-8">
          <li class="flex flex-col">
            <h3 class=" opacity-60 text-navy-600 dark:text-navy-300">origin</h3>
            <p>{origin}</p>
          </li>
          <li class="flex flex-col">
            <h3 class=" opacity-60 text-navy-600 dark:text-navy-300">IFRA</h3>
            <p>{ifraStatus}</p>
          </li>
          <li class="flex-col flex">
            <h3 class=" opacity-60 text-navy-600 dark:text-navy-300">contributors</h3>
            <p>{contributors}</p>
          </li>
        </ul>
      </div>
    </div>
  
    <div class="w-full h-32 relative overflow-hidden text-navy-600 dark:text-navy-300">
      {#if unsplashData}
      <img 
        alt={ingredient.common_name} 
        src={unsplashData.urls.regular} 
        class="w-full h-full object-cover rounded"
      />
      <p class="absolute text-sm italic bottom-2 right-2 px-2 py-1 bg-blend-screen bg-stone-50 text-stone-900 rounded">
        Photo by <a href={href}>{unsplashData.user.name}</a> on <a href="https://unsplash.com/?utm_source=bcf&utm_medium=referral">Unsplash</a>
      </p>
      {/if}
    </div>
  </div>


{#if showSuggestion}
<Suggestion {ingredient} />
{/if}

</AppWrap>