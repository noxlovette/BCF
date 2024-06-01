<script lang="ts">
  import { fetchCollection } from "$lib/DjangoAPI";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { goto } from '$app/navigation';
  import {blur} from 'svelte/transition';
  import Loader from "$lib/components/Loader.svelte";
  import ArrowLeftIcon from "$lib/icons/ArrowLeftIcon.svelte";
  import ArrowRightIcon from "$lib/icons/ArrowRightIcon.svelte";
  import ResetIcon from "$lib/icons/ResetIcon.svelte";
  import CollectCardExpanded from "$lib/components/CollectCardExpanded.svelte";
  import CollectCard from "$lib/components/CollectCard.svelte";
  import { notification } from '$lib/stores/notificationStore';
    import AddCrossIcon from "$lib/icons/AddCrossIcon.svelte";



  export let collection = [];

  let pageSize = writable(9);
  let currentPage = writable(1);
  let searchTerm = writable("");
  let searchInput:any = null;
  let isLoading = true;
  let editedIngredient = null;
  let filteredCollection = [];
  let startIndex = 0;
  let paginatedCollection = [];
  
  async function handleFetch(forceReload = false) {
    const data = await fetchCollection({ forceReload: forceReload });
    return data;
  }

  async function reset() {
    searchTerm.set("");
    currentPage.set(1);
    collection = await handleFetch(true);
    editedIngredient = null;
    filteredCollection = collection;
    }

  // pagination logic, pagesize logic
async function updatePageSize() {
    currentPage.set(1);
    goto(`/collect?page=${$currentPage}&search=${$searchTerm}&page_size=${$pageSize}`);
}
  
async function changePage(increment) {
    if ($currentPage + increment >= 1 && $currentPage + increment <= totalPages) {
      currentPage.update((value) => value + increment);
      notification.set({message:`you are on page ${$currentPage}`, type:"info"});
    }
    else {
      notification.set({message:`there is nothing to seek there`, type:"error"});
  }
}

async function handleSearch() {
    currentPage.set(1);
    if ($searchTerm === "") {
      notification.set({message:"Showing everything", type:"info"})
    } else {
      notification.set({message:`Searching for ${$searchTerm}...`, type:"info"});
    }
    goto(`/collect?page=${$currentPage}&search=${$searchTerm}&page_size=${$pageSize}`);
  }

const handleSearchCollection = () => {
    filteredCollection = collection.filter(ingredient => {
      const commonName = ingredient.common_name || '';
      const cas = ingredient.cas || '';
      return commonName.toLowerCase().includes($searchTerm.toLowerCase()) ||
             cas.toLowerCase().includes($searchTerm.toLowerCase());
    });
  }
  

// Compute the start index for slicing the array based on the current page and page size
$: {
  startIndex = ($currentPage - 1) * $pageSize;
}

let totalPages:number = 0;

$: {
  try {
    paginatedCollection = filteredCollection.slice(startIndex, startIndex + $pageSize);
    totalPages = Math.ceil(filteredCollection.length / $pageSize);
  } catch (error) {
    console.log(error);
  }
}

function feedCustomIngredient() {
  editedIngredient = {
    id: null,
    common_name: "",
    cas: "",
    volatility: "",
    use: "",
  };
  chosenIngredient = editedIngredient;
}


onMount( async () => {
    let is_authenticated = sessionStorage.getItem("is_authenticated");
    if (is_authenticated === "false" || is_authenticated === null) {
      notification.set({message:"Please log in to access this page", type:"error"})
      goto("/auth/login");
    } else {
    currentPage.set((parseInt(sessionStorage.getItem('currentPageCollect')) || 1));
    pageSize.set((parseInt(localStorage.getItem('pageSizeCollect')) || 10));
    searchTerm.set((sessionStorage.getItem('searchTermCollect') || ""));
    }

    collection = await handleFetch();
    if (collection) {
      isLoading = false;
    }
    
    filteredCollection = collection;
    currentPage.subscribe(value => sessionStorage.setItem('currentPageCollect', value.toString()));
    pageSize.subscribe(value => localStorage.setItem('pageSizeCollect', value.toString()));
    searchTerm.subscribe(value => {
        sessionStorage.setItem('searchTermCollect', value);
    });

    
  });

  let chosenIngredient:any = null;
  function toggleOverlay() {
    chosenIngredient = null;
    editedIngredient = null;
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
    } else if (event.key === 'Escape') {
      if (document.activeElement === searchInput) {
        searchInput.blur();
        searchTerm.set('');

      } else {
        event.preventDefault();
        toggleOverlay();
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

  const description = "Collect perfume ingredients. Leave comments, manage your laboratory.";
const ogTitle = "BCF | Collect";
const ogUrl = "https://bcfapp.app/collect";
const imageUrl = "https://bcfapp.app/assets/img/dalle-collect-1.webp";

</script>

<svelte:window on:keydown={handleKeydown}/>

<svelte:head>
  <title>BCF | Collect</title>
  <meta name="description" content={description}>
  <meta property="og:title" content={ogTitle}>
  <meta property="og:description" content={description}>
  <meta property="og:image" content={imageUrl}>
  <meta property="og:url" content={ogUrl}>
</svelte:head>


  <button 
    id="overlay" 
    class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-stone-900 bg-opacity-20 backdrop-blur z-30 transition-all bg-blend-darken" 
    class:hidden={!chosenIngredient} 
    on:mousedown={toggleOverlay}
    aria-label="Toggle Overlay"
  >
  <div >
  <CollectCardExpanded ingredient={chosenIngredient} bind:filteredCollection bind:collection bind:editedIngredient bind:chosenIngredient />
  </div>
</button>

    <div id = "app" class="flex flex-col items-center lowercase my-8 caret-rose-700">
      <form id="search-bar" class="justify-center flex-col sm:flex-row max-w-5xl lg:max-w-5xl flex w-full sm:px-12 space-x-0 space-y-4 sm:space-y-0 sm:space-x-4 items-center group">
        <button class="rounded-full bg-rose-700 text-rose-50 p-2 shadow active:shadow-none hover:bg-white dark:hover:bg-stone-800 border border-rose-700 hover:shadow-lg hover:text-rose-700 transition-all"
        on:mousedown={feedCustomIngredient}>
        <AddCrossIcon />
        </button>
        <input
          type="text"
          class = "w-[250px] md:w-[325px] lg:w-[600px] shadow border-none bg-white dark:bg-stone-800 focus:ring-rose-700/60 hover:shadow-lg focus:ring-2 rounded-lg focus:scale-95 active:scale-90 transition-all"
          bind:value={$searchTerm}
          bind:this={searchInput}
          on:input={handleSearchCollection}
          placeholder="/ search ingredients..."
          title="find an ingredient by CAS or the multiple names that it might have"
        />
            
        <button on:mousedown={reset} title="reset everything" class="rounded-full bg-rose-700 text-rose-50 p-2 shadow hidden sm:block active:shadow-none hover:bg-white dark:hover:bg-stone-800 border border-rose-700 hover:shadow-lg hover:text-rose-700 transition-all">
          <ResetIcon />
        </button>

        <label class="items-center md:text-md sm:text-sm mr-auto opacity-60 hover:opacity-100 transition-opacity group hidden lg:block">
          per page:
          <input type="number" class='w-1/3 group-hover:shadow border-none focus:ring-rose-400/70 focus:ring-2 rounded-lg dark:bg-stone-800' min="1" bind:value={$pageSize} on:change={updatePageSize}/>
        </label>

        
        <div id="pagination" class="flex group active:shadow-none hover:bg-white dark:hover:bg-stone-800 border border-rose-700 hover:shadow-lg hover:text-rose-700 transition-all justify-center items-center w-[100px] rounded-full bg-rose-700 text-rose-50 p-2 shadow {($currentPage <= 1 && $currentPage >= totalPages) ? 'invisible' : 'visible'}"

        >
          {#if $currentPage > 1}
          <button id="prevPage" on:mousedown={() => changePage(-1)} class="active:scale-90 transition-all hover:-translate-x-2">
              <ArrowLeftIcon />
          </button>
          {/if}
          {#if $currentPage < totalPages}
          <button id="nextPage" on:mousedown={() => changePage(1)} class="active:scale-90 transition-all hover:translate-x-2">
              <ArrowRightIcon />
          </button>
          {/if}
      </div>
      
      </form>

<div id="table-wrapper" class="flex flex-row h-full ml-6 mr-6 mt-0 p-2 overflow-x-auto overflow-y-auto text-sm items-center">
{#if isLoading || collection === null}
<Loader />
{:else if filteredCollection.length === 0}
<p class="text-5xl mt-12">hm. try a different search?</p>
  {:else}
  
  <div id="wrapper" class="rounded-lg p-8"

  in:blur={{duration:150}}
  >

  <div id="card-holder" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
    {#each paginatedCollection as ingredient}
    {#if ingredient}
      <CollectCard ingredient={ingredient} bind:chosenIngredient bind:filteredCollection />
    {/if}
    {/each}
  </div>
  
  </div>
  {/if}
  </div>

</div>
