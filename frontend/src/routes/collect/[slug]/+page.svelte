<script lang="ts">
  import type { PageServerData } from "./$types";
  import RoundButton from "$lib/components/UI/RoundButton.svelte";
  import SuggestionIcon from "$lib/icons/SuggestionIcon.svelte";
  import MetaData from "$lib/components/MetaData.svelte";
  import AppWrap from "$lib/components/AppWrap.svelte";
  import { user } from "$lib/stores";
    import EditCollect from "$lib/components/EditCollect.svelte";

  export let data: PageServerData;
  let editing = false;

  const ingredient = data.ingredient;

  let volatility = ingredient.volatility || 'unknown';
  let useMessage = ingredient.use || 'Nobody has added a use for this ingredient yet';
  let colour = ingredient.colour || 'unknown';
  let impression = ingredient.impression || 'unknown';
  let associations = ingredient.associations || 'unknown';
  let ideas = ingredient.ideas || 'unknown';
  let origin = ingredient.origin || 'unknown';
  
</script>

<MetaData title="{ingredient.common_name}" />

<AppWrap class="2xl:px-24 select-text caret-grapefruit-800 selection:bg-grapefruit-100 selection:text-grapefruit-800">
  <div class=" rounded-lg border-grapefruit-800">
    <div id="top-part" class="flex flex-row items-center p-8 rounded-t-lg bg-grapefruit-700 text-grapefruit-50 border-b border-grapefruit-800">
      <div id="top-left" class="flex w-3/4 flex-col space-y-2 pr-24">
        <h1 class="flex w-full text-5xl font-bold tracking-tighter font-quicksand">
          {ingredient.common_name}
        </h1>
      </div>
      <div id="top-right" class=" flex-1 flex-col flex">
        <h2 class="mb-2 min-w-fit text-2xl font-quicksand">{ingredient.cas}</h2>
        <h2 class="lowercase">{volatility} <span class="opacity-60">note</span></h2>
      </div>
      {#if $user.is_authenticated}
      <div class="flex space-x-2 items-center justify-center rounded-lg flex-1">
        <RoundButton on:click={() => editing = !editing}>
          <SuggestionIcon />
        </RoundButton>
      </div>
      {/if}
    </div>
  
    <div id="bottom-part" class="flex flex-row p-8 ">
      <div id="bottom-left" class="flex w-3/4 flex-col pr-24">
        <p class="opacity-60">how to use</p>
        <p class="py-4 ">{useMessage}</p>
        <p class="opacity-60">impression</p>
        <p class="py-4">{impression}</p>

        <ul class="flex flex-col mt-auto space-y-4">
          <li class="flex flex-col">
            <h3 class=" opacity-60">associations</h3>
            <p class="w-full">{associations}</p>
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
            <h3 class=" opacity-60">Colour</h3>
            <p>{colour}</p>
          </li>
          <li class="flex-col flex">
            <h3 class=" opacity-60">ideas</h3>
            <p>{ideas}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>

  {#if editing}
  <EditCollect ingredient={ingredient} bind:editing />
  {/if}

</AppWrap>