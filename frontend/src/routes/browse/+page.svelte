<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import {fetchDescriptors, fetchIngredientsBrowse} from "$lib/DjangoAPI";
  import {tick} from "svelte";
  import { writable } from "svelte/store";
  import {blur, fade} from "svelte/transition";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import BrowseCard from "$lib/components/BrowseCard.svelte";
  import ArrowLeftIcon from "./ArrowLeftIcon.svelte";
    import ArrowRightIcon from "./ArrowRightIcon.svelte";
    import ResetIcon from "./ResetIcon.svelte";
    import BrowseCardExpanded from "$lib/components/BrowseCardExpanded.svelte";


  export let data: any = null;
  export let currentPage = writable();
  export let pageSize = writable();
  export let searchTerm = writable("");
  export let overlay:boolean = false;
  let suggestedIngredient = null;
  let chosenIngredient:any = null;
  let chosenDescriptors = [];
  let showFilterMenu = false;
  let searchInput;
  let showSuggestion = false;

  interface Field {
  name: string;
  visible: boolean;
}

interface Ingredient {
  [key: string]: string; // Index signature for dynamic properties
}
  
  let showTuneMenu = false;
  let isLoading = true;
  let notification = writable("");
  let descriptors = []
  let searchTermDescriptor = "";
  let filteredDescriptors = [];
  let sortedDescriptors = [];

  onMount(async () => {
    // Set currentPage and searchTerm based on the initial props
    currentPage.set((parseInt(sessionStorage.getItem('currentPage')) || 1));
    pageSize.set((parseInt(localStorage.getItem('pageSize')) || 10));
    searchTerm.set((sessionStorage.getItem('searchTerm') || ""));
    data = await load();
    isLoading = false;
    
    
    descriptors = await fetchDescriptors();
    filteredDescriptors = descriptors;

    currentPage.subscribe(value => sessionStorage.setItem('currentPage', String(value)));
    pageSize.subscribe(value => localStorage.setItem('pageSize', String(value)));
    searchTerm.subscribe(value => sessionStorage.setItem('searchTerm', String(value)));
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



  async function searchIngredients() {
    currentPage.set(1);
    if ($searchTerm === "") {
      notification.set("")
    } else {
      notification.set(`Searching for ${$searchTerm}...`);
    }
    goto(`/browse?page=${$currentPage}&search=${$searchTerm}&page_size=${$pageSize}`);

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

function toggleOverlay() {
    chosenIngredient = null;
    showSuggestion = false;
    suggestedIngredient = null;
  }


</script>
<svelte:window on:keydown={handleKeydown}/>
<svelte:head>
  <title>BCF | Browse</title>
</svelte:head>

<div class="flex flex-col min-h-screen z-0" style="background: url('/assets/bg/bbblurry-browse.svg') no-repeat center center fixed; background-size: cover;">
  <button 
    id="overlay" 
    class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-20 backdrop-blur z-30 transition-all bg-blend-darken" 
    class:hidden={!chosenIngredient} 
    on:mousedown={toggleOverlay}
    aria-label="Toggle Overlay"
  >
  <div >
  <BrowseCardExpanded ingredient={chosenIngredient} bind:notification bind:showSuggestion bind:suggestedIngredient />
  </div>
</button>
  <Header currentPage="browse" notification = {notification}/>
  <div class="mb-auto">

    <div id = "app" class="flex flex-col items-center lowercase my-8">
      <form id="search-bar" class="justify-center max-w-5xl flex w-full px-12 space-x-4 items-center group">
       
        <button on:mousedown={toggleFilterMenu} title="filter by descriptors" class="rounded-lg p-2 text-center bg-sky-700 text-sky-50 hover:text-stone-800 hover:bg-white transition-all shadow hover:shadow-lg">
          {#if showFilterMenu}
            ingredients
          {:else}
            descriptors
          {/if}
        </button>
          {#if showFilterMenu}
        <input
          type="text"
          class = "w-[600px] shadow border-none bg-white dark:bg-black focus:ring-amber-400/70 hover:shadow-lg focus:ring-2 rounded-lg focus:scale-95 active:scale-90 transition-all"

          bind:this = {searchInput}
          bind:value = {searchTermDescriptor}
          on:input = {searchDescriptors}

          placeholder="/ search descriptors..."
          title="find the descriptor that you are looking for"
        />

          {:else}
      
        <input
          type="text"
          class = "w-[600px] shadow border-none bg-white dark:bg-black focus:ring-sky-700/60 hover:shadow-lg focus:ring-2 rounded-lg focus:scale-95 active:scale-90 transition-all"
          bind:value={$searchTerm}
          bind:this = {searchInput}
          on:keydown={handleSearch}
          placeholder="/ search ingredients..."
          title="find an ingredient by CAS or the multiple names that it might have"
        />
          {/if}
            
        <button on:mousedown={reset} title="reset everything" class="rounded-full bg-sky-700 text-sky-50 p-2 shadow">
          <ResetIcon />
        </button>

        <label class="items-center md:text-md sm:text-sm mr-auto opacity-60 hover:opacity-100 transition-opacity group">
          per page:
          <input type="number" class='w-1/3 group-hover:shadow border-none focus:ring-amber-400/70 focus:ring-2 rounded-lg' min="1" bind:value={$pageSize} on:change={updatePageSize}/>
        </label>

        
        <div id="pagination" class="flex group justify-center items-center w-[100px] rounded-full bg-sky-700 text-sky-50 p-2 shadow {showFilterMenu || ($currentPage <= 1 && $currentPage >= data.total_pages) ? 'invisible' : 'visible'}"

        >
          {#if !showFilterMenu && $currentPage > 1}
          <button id="prevPage" on:mousedown={() => changePage(-1)} class="">
              <ArrowLeftIcon />
          </button>
          {/if}
          {#if !showFilterMenu && $currentPage < data.total_pages}
          <button id="nextPage" on:mousedown={() => changePage(1)} class="">
              <ArrowRightIcon />
          </button>
          {/if}
      </div>
      
      </form>
    



          <div id="table-wrapper" class="relative flex flex-row mx-8 overflow-x-auto overflow-y-auto items-center xl:font-medium font-normal select-text selection:bg-sky-300/40
          ">
        {#if isLoading || data === null}
          <!-- If isLoading is true, display a loading message -->
          <Loader />
    
          
          {:else if data.results.length === 0}
          <!-- If there are no results, display a message -->
          <p class="text-2xl">hm. try a different search?</p>
          
        {:else}
        <div id="table bg" class="rounded-lg p-8"
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
            size-4 rounded-full shadow border-none text-amber-600/90 focus:ring-amber-400/30 checked:bg-amber-700/70 checked:ring-amber-700/30 hover:checked:bg-amber-600/80 transition-all hover:scale-110" 
            type="checkbox" id={descriptor.name} bind:group={chosenDescriptors} value={descriptor}/>
            {descriptor.name}
            </label>
          </div>

          {/each}
          {:else}
          <p>no descriptors found</p>
          {/if}
      </div>

{:else}
<div id="card-holder" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {#each data.results as ingredient}
          {#if ingredient}
          <BrowseCard {ingredient} bind:chosenIngredient bind:notification />
          {/if}
          {/each}
      </div>

{/if}
        </div>
        {/if}
        </div>
      </div>
    </div>
  <Footer />
</div>
