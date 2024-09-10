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

  console.log(unsplashData);

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


    

</script>

<MetaData title="{ingredient.common_name}" description="{ingredient.descriptors}" />

<AppWrap class="2xl:px-24 select-text caret-navy-800 selection:bg-navy-100 selection:text-navy-800">
  <div class=" rounded-lg border-navy-800">
    <div id="top-part" class="flex flex-row items-center p-8 rounded-t-lg bg-navy-700 text-navy-50 border-b border-navy-800">
      <div id="top-left" class="flex w-3/4 flex-col space-y-2 pr-24">
        <h1 class="flex w-full text-5xl font-bold tracking-tighter font-space">
          {ingredient.common_name}
        </h1>
        <h2 class="w-full lowercase"><span class="opacity-60">descriptors:</span> {ingredient.descriptors}</h2>
      </div>
      <div id="top-right" class=" flex-1 flex-col flex">
        <h2 class="mb-2 min-w-fit text-2xl font-space">{ingredient.cas}</h2>
        <h2 class="lowercase">{volatility} <span class="opacity-60">note</span></h2>
      </div>
      {#if $user.is_authenticated}
      <div class="flex space-x-2 items-center justify-center rounded-lg flex-1">
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
  
    <div id="bottom-part" class="flex flex-row p-8 ">
      <div id="bottom-left" class="flex w-3/4 flex-col pr-24">
        <p class="opacity-60">how to use</p>
        <p class="py-4 ">{useMessage}</p>
        
        <ul class="flex flex-col mt-auto space-y-4">
          <li class="flex flex-col">
            <h3 class=" opacity-60">similar ingredients</h3>
            <p class="w-full">{similarIngredients}</p>
          </li>
          <li class="flex flex-col">
            <h3 class=" opacity-60">other names</h3>
            <p class="w-full">{otherNames}</p>
          </li>
        </ul>
      </div>
  
      <div id="bottom-right" class="flex flex-1 flex-col">
        <ul class="space-y-8">
          <li class="flex flex-col">
            <h3 class=" opacity-60">origin</h3>
            <p>{origin}</p>
          </li>
          <li class="flex flex-col">
            <h3 class=" opacity-60">IFRA</h3>
            <p>{ifraStatus}</p>
          </li>
          <li class="flex-col flex">
            <h3 class=" opacity-60">contributors</h3>
            <p>{contributors}</p>
          </li>
        </ul>
      </div>
    </div>
  
    <div class="w-full h-32 overflow-hidden"> <!-- Set the parent div as thin -->
      <img 
        alt={ingredient.common_name} 
        src={unsplashData.urls.regular} 
        class="w-full h-full object-cover rounded-b-lg"
      />
    </div>
  </div>
<p class="text-sm italic">
  Photo by <a href={href}>{unsplashData.user.name}</a> on <a href="https://unsplash.com/?utm_source=bcf&utm_medium=referral">Unsplash</a>
</p>


{#if showSuggestion}
<Suggestion {ingredient} />
{/if}

</AppWrap>