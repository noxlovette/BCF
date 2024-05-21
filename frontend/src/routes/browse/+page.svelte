<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import {addSuggestionBrowse, fetchDescriptors, addToCollectionBrowse, fetchIngredientsBrowse} from "$lib/DjangoAPI";
  import {tick} from "svelte";
  import { writable } from "svelte/store";
  import {blur, fade} from "svelte/transition";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Loader from "$lib/components/Loader.svelte";

  export let data: any = null;
  export let currentPage = writable();
  export let pageSize = writable();
  export let searchTerm = writable();
  let chosenDescriptors = [];
  let showSuggestion = false;
  let showFilterMenu = false;
  let suggestedIngredient: Ingredient = null;
  let searchInput;
  
  interface Field {
  name: string;
  visible: boolean;
}

interface Ingredient {
  [key: string]: string; // Index signature for dynamic properties
}

  let initialVisibleFields: Field[] = [
  { name: "common_name", visible: true },
  { name: "cas", visible: false },
  { name: "volatility", visible: false },
  { name: "ingredient_type", visible: false},
  { name: "use", visible: false },
  { name: "descriptors", visible: true },
  { name: "origin", visible: false},
  { name: "constituents", visible: false},
  { name: "similar_ingredients", visible: false},
  { name: "is_restricted", visible: false },
  { name: "contributors", visible: false},
  { name: "actions", visible: true },
];

  const visibleFields = writable<Field[]>(initialVisibleFields);
  
  let showTuneMenu = false;
  let isLoading = true;
  let notification = writable("");
  let descriptors = []
  let searchTermDescriptor = "";
  let filteredDescriptors = [];
  let is_authenticated = null;
  let sortedDescriptors = [];

  onMount(async () => {
    // Set currentPage and searchTerm based on the initial props
    currentPage.set((parseInt(sessionStorage.getItem('currentPage')) || 1));
    pageSize.set((parseInt(localStorage.getItem('pageSize')) || 10));
    searchTerm.set((sessionStorage.getItem('searchTerm') || ""));
    visibleFields.set(loadFieldPreference());
    
    
    data = await load();
    isLoading = false;
    is_authenticated = sessionStorage.getItem("is_authenticated");
    
    descriptors = await fetchDescriptors();
    filteredDescriptors = descriptors;

    currentPage.subscribe(value => sessionStorage.setItem('currentPage', String(value)));

    pageSize.subscribe(value => localStorage.setItem('pageSize', String(value)));

    searchTerm.subscribe(value => sessionStorage.setItem('searchTerm', String(value)));

    visibleFields.subscribe(fields => {
    localStorage.setItem('visibleFields', JSON.stringify(fields));
  });
  });

  function sortDescriptors(descriptors) {
    return descriptors.sort((a, b) => a.name.localeCompare(b.name));
  }

  $: {
    sortedDescriptors = sortDescriptors(filteredDescriptors);
    if (chosenDescriptors.length > 0) {
      notification.set(`filtering by ${chosenDescriptors.map(descriptor => descriptor.name).join(', ')}`);
      
      fetchWithDescriptors();

    }
  }

  let filterMenu;
  function handleClickOutside(event) {
    if (filterMenu && !filterMenu.contains(event.target)) {
      console.log("clicked outside")
      document.removeEventListener('click', handleClickOutside);
      showFilterMenu = false;
    }
  }

async function fetchWithDescriptors() {
  currentPage.set(1);
  data = await load()
}

  function handleKeydown(event) {
    if (event.key === '/') {
        event.preventDefault();  // Prevents the default action associated with the '/' key

        // Toggle focus
        if (document.activeElement === searchInput) {
            searchInput.blur();  // If the searchInput is already focused, unfocus it
        } else {
            searchInput.focus();  // Otherwise, set the focus on the searchInput
        }
    } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        changePage(- 1);
    } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        changePage(+ 1);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        changePage(- 1);
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        changePage(+ 1);
}
  }

  async function load() {
    return await fetchIngredientsBrowse(Number($currentPage), String($searchTerm), Number($pageSize), chosenDescriptors);
  }

  async function reset() {
    searchTerm.set("");
    currentPage.set(1);
    chosenDescriptors = [];
    notification.set("resetting everything...");
    goto(`/browse?page=${$currentPage}&search=${$searchTerm}&page_size=${$pageSize}`);
    data = await load();
  }

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
  
  notification.set(response);
}

  async function searchIngredients() {
    currentPage.set(1);
    if ($searchTerm === "") {
      notification.set("")
    } else {
      notification.set(`Searching for ${$searchTerm}...`);
    }
    goto(`/browse?page=${$currentPage}&search=${$searchTerm}&page_size=${$pageSize}`);
    suggestedIngredient = null;
    data = await load();
  }

  function handleSearch(event) {
    if (event.key === 'Enter') {
      searchIngredients();
    } else if (event.key === 'Escape') {
      searchTerm.set("");
      searchInput.blur();
      searchIngredients();
    } 

  }

  function handleDescriptorChange() {

    
    }
  
    

  const searchDescriptors = () => {
    return filteredDescriptors = descriptors.filter(descriptor => descriptor.name.toLowerCase().includes(searchTermDescriptor.toLowerCase()));
  }
  

  async function changePage(increment) {
    
    if ($currentPage + increment >= 1 && $currentPage + increment <= (data as { total_pages: number }).total_pages) {
      
      currentPage.update((value) => value + increment);
      notification.set(`you are on page ${$currentPage}/${(data as { total_pages: number }).total_pages}`);
      goto(`/browse?page=${$currentPage}&search=${$searchTerm}&page_size=${$pageSize}`);
      data = await load();
    }
    else {
      notification.set(`there is nothing to seek there`);
  }
}

async function updatePageSize() {
    goto(`/browse?page=${$currentPage}&search=${$searchTerm}&page_size=${$pageSize}`);
    
    data = await load(); // Wait for the URL to be updated before loading new data
}

function toggleTuneMenu() {
  showTuneMenu = !showTuneMenu;
}

async function toggleFilterMenu() {
  showFilterMenu = !showFilterMenu;
  await tick();
  if (showFilterMenu) {
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside)}, 100);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

  showTuneMenu = false;
}

function loadFieldPreference() {
    const storedFields = localStorage.getItem('visibleFields');
    return storedFields ? JSON.parse(storedFields) : initialVisibleFields;
  }

//! might not work as expected
  function toggleFieldVisibility(field) {
  field.visible = !field.visible;
  visibleFields.update(fields => [...fields]); 
}


async function handleAddIngredient(ingredientId) {
  if (is_authenticated !== null) {
    const response = await addToCollectionBrowse(ingredientId);
    notification.set(response);
  } else {
    notification.set("you need to be logged in to add ingredients to your collection");
  }
}


</script>
<svelte:window on:keydown={handleKeydown}/>
<svelte:head>
  <title>BCF | Browse</title>
</svelte:head>

<div class="flex flex-col min-h-screen z-0" style="background: url('/assets/bg/bbblurry-browse.svg') no-repeat center center fixed; background-size: cover;">
  <Header currentPage="browse" notification = {notification}/>
  <div class="mb-auto">
    <div id = "app" class="flex flex-col items-center mt-0 lowercase font-light text-sky-900/80 dark:text-sky-200/80 select-text selection:bg-sky-300/40">
      {#if showSuggestion}
      <div id = "suggestion" class="flex flex-col space-x-2 w-3/4 justify-center items-stretch p-4 m-4 bg-white/20 dark:bg-black/20 rounded-lg text-sky-900/80 dark:text-sky-200/90">
        <div class="flex flex-row items-start align-middle">
        <h2 class="flex text-center font-black p-4 text-2xl lg:text-xl sm:text-md">you are editing {suggestedIngredient.common_name}</h2>
        <div class="flex flex-row ml-auto space-x-4">
          <button on:click={submitSuggestion}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 hover:text-amber-400/90 active:scale-90 transition-all hover:scale-110">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </button>
          <button on:click={toggleSuggestion}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 hover:text-amber-400/90 active:scale-90 transition-all hover:scale-110">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>          
          </button>
        </div>
        </div>
        <div id="suggestion grid" class="grid grid-cols-3 space-x-4 p-4 space-y-1 mb-auto sm:text-sm md:text-md lg:text-base">
        {#each Object.entries(suggestedIngredient).slice(2, -1) as [key, value]}
        
        <label class="flex items-center font-bold ml-4">{key.replace(/_/g, ' ')}
          <textarea class="flex ml-auto font-light border-none bg-white/20 dark:bg-black/20 rounded-lg focus:ring focus:ring-amber-400/70 focus:border-amber-400/70" placeholder={value} bind:value={suggestedIngredient[key]}/>
        </label>

        {/each}
        <label class="flex items-center font-bold ml-4 border-none rounded-lg focus:ring focus:ring-amber-400/70 focus:border-amber-400/70">message
          <textarea class="flex ml-auto font-light border-none bg-white/20 dark:bg-black/20 rounded-lg focus:ring focus:ring-amber-400/70 focus:border-amber-400/70" bind:value={message}/>
        </label>
        
      </div>
        
      </div>
      {:else}
      <div id="tools" class="flex flex-row w-full justify-center space-x-2">
        <div id="search-bar" class="flex flex-row w-1/2 justify-between space-x-2">
          {#if !showFilterMenu && $currentPage > 1}
        <button id="prevPage" class="pl-2" on:click={() => changePage(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 hover:text-amber-400/90 active:scale-90 transition-all hover:scale-110 hover:-transtone-x-2 duration-300">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          
          
        </button>
        {/if}
          
          <button on:click={toggleTuneMenu}
          title="tune the table"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-amber-400/90 active:scale-90 transition-all hover:scale-110">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
            
            
          </button>

          <button on:click={toggleFilterMenu} title="filter by descriptors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-amber-400/90 active:scale-90 transition-all hover:scale-110">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
            </svg>
            
          </button>

          <!-- Tune menu -->
          {#if showTuneMenu}
        <div id="tune menu" class="flex flex-row w-full p-2 border border-none bg-white/20 dark:bg-black/20 space-y-2 items-center rounded-lg divide-x-2 lg:text-base md:text-sm sm:text-xs">
            <div class="w-1/3 ">
          <label class="flex px-2 items-center md:text-md sm:text-sm md:flex-col lg:flex-row">
            per page:
            <input type="number" class = 'flex ml-2 border-none bg-white/20 dark:bg-black/20 focus:ring-amber-400/70 focus:ring-2 rounded-lg w-1/2' min="1" bind:value={$pageSize} on:change={updatePageSize}/>
          </label>
        </div>
        
          <div id="visibility" class="grid lg:grid-cols-2 sm:grid-cols-1">
            {#each $visibleFields.slice(1, -1) as field}
            <div class="flex flex-row items-center">
              <input class= 
              "mx-4 my-2
              size-4 rounded-full shadow border-none text-amber-600/90 focus:ring-amber-400/30 checked:bg-amber-700/70 checked:ring-amber-700/30 hover:checked:bg-amber-600/80 transition-all hover:scale-110
              
              " 
              
              
              type="checkbox" id={field.name} bind:checked={field.visible} on:click={() => toggleFieldVisibility(field)} />
              <label for={field.name}>{field.name.replace(/_/g, ' ')}</label>
              </div>
            {/each}
          </div>
          
          <!-- Filter menu -->
        </div>
        {:else if showFilterMenu}
          <input
            type="text"
            class = "flex w-full p-2 shadow border-none bg-white/20 dark:bg-black/20 focus:ring-amber-400/70 focus:ring-2 rounded-lg focus:scale-95 active:scale-90 transition-all"

            bind:this = {searchInput}
            bind:value = {searchTermDescriptor}
            on:input = {searchDescriptors}

            placeholder="/ search descriptors..."
            title="find the descriptor that you are looking for"
          />


        {:else}
        
          <input
            type="text"
            class = "flex w-full p-2 md:text-md lg:text-base shadow border-none bg-white/20 dark:bg-black/20 focus:ring-amber-400/70 focus:ring-2 rounded-lg focus:scale-95 active:scale-90 transition-all"
            bind:value={$searchTerm}
            bind:this = {searchInput}
            on:keydown={handleSearch}
            placeholder="/ search ingredients..."
            title="find an ingredient by CAS or the multiple names that it might have"
          />

          {/if}
          <button on:click={searchIngredients}
          title="search for ingredients"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-amber-400/90 active:scale-90 transition-all hover:scale-110">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            
          </button>
          <button on:click={reset} title="reset everything">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-amber-400/90 active:scale-90 transition-all hover:scale-110">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            
          </button>
          {#if !showFilterMenu && $currentPage < data.total_pages}
        <button class="pr-2" id="nextPage" on:click={() => changePage(1)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 hover:text-amber-400/90 active:scale-90 transition-all hover:scale-110 hover:transtone-x-2 duration-300">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            
            
          </button>
        {/if}
        </div>
        
      </div>
      {/if}
    
      <div id="table-wrapper" class="flex flex-row ml-8 mr-8 mt-0 p-2 overflow-x-auto overflow-y-auto items-center xl:font-medium font-normal">
        
        {#if isLoading || data === null}
          <!-- If isLoading is true, display a loading message -->
          <Loader />
    
          
          {:else if data.results.length === 0}
          <!-- If there are no results, display a message -->
          <p class="text-2xl">hm. try a different search?</p>
          
        {:else}
        <div id="table bg" class="shadow bg-gradient-to-br from-sky-300/10 to-sky-500/10 rounded-lg p-4 mt-4 background-element"
        in:blur={{duration: 150}}
        >

        {#if showFilterMenu}
      <div id="filter" class="grid xl:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 gap-4 w-full p-2 border-none bg-white/20 dark:bg-black/20 items-center rounded-lg"
      in:fade={{duration: 150}}
      bind:this={filterMenu}
      >
        {#if filteredDescriptors.length !== 0 && filteredDescriptors}
        {#each sortedDescriptors as descriptor}
        <div class="flex md:flex-col xl:flex-row">
              <label class="md:text-md sm:text-sm lg:text-base" title={descriptor.description}>
            <input class= 
            "mx-2
            size-4 rounded-full shadow border-none text-amber-600/90 focus:ring-amber-400/30 checked:bg-amber-700/70 checked:ring-amber-700/30 hover:checked:bg-amber-600/80 transition-all hover:scale-110
            
            " 
  
            type="checkbox" id={descriptor.name} bind:group={chosenDescriptors} value={descriptor}
            on:change={() => { handleDescriptorChange();  }} />

            {descriptor.name}
            </label>
          </div>

          {/each}
          {:else}
          <p>no descriptors found</p>
          {/if}
      </div>

{:else}
          
          <table class="bg-blend-screen rounded-lg shadow-lg size-full table-fixed border-collapse border-spacing-0 bg-gradient-to-br from-sky-50/90 to-sky-100/30 dark:from-sky-900/20 dark:to-sky-950/20"
          in:fade={{delay:50, duration: 150}}
          >
            <thead class="rounded-lg bg-gradient-to-br from-sky-600/40 to-sky-700/40 h-10 dark:text-sky-200/80 dark:from-sky-300/10 dark:to-sky-400/10 text-xl md:text-base sm:text-sm lg:text-lg text-sky-900/80">
              <tr class="first:rounded-tl-lg first:font-black last:rounded-tr-lg align-middle">
                {#each $visibleFields as header}
                  {#if header.name === 'common_name' && header.visible}
                    <th class="w-1/4">ingredient</th>
                  {:else if header.name === 'cas' && header.visible}
                  <th class="max-w-fit">CAS</th>
                  {:else if header.name === 'use' && header.visible}
                  <th class="w-1/4">use</th>
                  {:else if header.name === 'similar_ingredients' && header.visible}
                  <th>similar</th>
                  {:else if header.name === 'actions' && header.visible}
                  <th class="max-w-fit">
                    <div id="icon container" class="flex justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                      </svg>
                    </div>
                  </th>
                  {:else if header.visible}
                  <th class="max-w-fit">{header.name.replace(/_/g, ' ')}</th>
                {/if}
              {/each}
              </tr>
            </thead>
            <tbody class="text-center divide-y-4 divide-double divide-amber-700/10 dark:divide-amber-400/10 border-b-6 border-sky-600/30" in:fade={{duration: 150}}>
    
              {#each data.results as ingredient}
                <tr on:dblclick={() => handleAddIngredient(ingredient.id)} class="hover:text-sky-600 first:rounded-tl-lg last:rounded-tr-lg sm:text-sm odd:bg-stone-50 even:bg-stone-100 dark:odd:bg-stone-950 dark:even:bg-stone-900 dark:hover:bg-amber-700/10 divide-x-4 divide-double divide-sky-600/10 dark:divide-sky-400/10 transition-all hover:rounded duration-300">

                  {#each $visibleFields as field}

                    {#if field.name === 'common_name' && field.visible}
                      <td title = "{ingredient.other_names}" class="align-middle m-4 p-4 tracking-tight font-extrabold text-ellipsis text-balance dark:bg-sky-700/10 bg-sky-300/10 ">{ingredient.common_name}</td>
                      {:else if field.name === 'is_restricted' && field.visible}
                      <td class="align-middle m-4 p-4">{ingredient[field.name] ? "yes" : "no"}</td>
                    {:else if field.name === 'actions' && field.visible}
                    <td class="align-middle m-4 p-4 ">
                      <div id="icon container" class="flex align-middle justify-center h-full space-x-2">

                        <button on:click={() => handleAddIngredient(ingredient.id)} title="add this ingredient to your collection">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 hover:text-amber-400/90 active:scale-90 active:text-amber-500/90 transition-all hover:scale-110">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          
                        </button>
                        <button on:click = {() => toggleSuggestion(ingredient)} title="want to contribute?">
  
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 hover:text-amber-400/90 active:scale-90 transition-all hover:scale-110">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
  
  
                        </button>
  
                      </div>
                      </td>
                      {:else if field.visible}
                      {#if ingredient[field.name] === null || ingredient[field.name] === ""}
                      <td class="align-middle m-4 p-4">
                      <div id="icon container" class="flex align-middle justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 hover:text-amber-400/90 active:scale-90 transition-all hover:scale-110">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                        </svg>
                        
                      </div>
                    </td>
                      {:else}
                      <td class="align-middle m-4 p-4 text-pretty">{ingredient[field.name]}</td>
                      {/if}
                    {/if}
                  
                  {/each}
                


                </tr>
              {/each}
            </tbody>
          </table>
{/if}
        </div>
        {/if}
      </div>
    </div>
  </div>
  <Footer />
</div>
