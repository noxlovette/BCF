<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { saveEditedIngredientCollect, fetchCollection, deleteFromCollection, createCustomIngredientCollect } from "$lib/DjangoAPI";
  import Header from "$lib/components/Header.svelte";
  import { fade } from "svelte/transition";
  import { writable } from "svelte/store";
  import Footer from "$lib/components/Footer.svelte";
  import { goto } from '$app/navigation';
  import {blur} from 'svelte/transition';
  import Loader from "$lib/components/Loader.svelte";


  export let collection = [];

  let pageSize = writable(10);
  let currentPage = writable(1);
  let searchTerm = writable("");
  let searchInput;
  let notification = writable("");
  let isLoading = true;
  let isEditing = false;
  let editingObject = null;
  let editingRowId = null;
  let isModalVisible = false;
  let filteredCollection = [];
  let startIndex = 0;
  let paginatedCollection = [];
  let initialVisibleFields = [
  { name: "common_name", visible: true },
  { name: "cas", visible: false },
  { name: "volatility", visible: false },
  { name: "use", visible: false },
  { name: "colour", visible: true },
  { name: "ideas", visible: false },
  { name: "impression", visible: true },
  { name: 'associations', visible: false },
  { name: "amount", visible: true },
  { name: 'date_added', visible: false }
];
  export let visibleFields = writable(initialVisibleFields);
  
  //fetch logic
  //TODO error handing for handleFetch
  async function handleFetch(forceReload = false) {
    const data = await fetchCollection({ forceReload: forceReload });
    return data;
  }

  async function reset() {
    searchTerm.set("");
    currentPage.set(1);
    collection = await handleFetch(true);
    editingRowId = null;
    editingObject = null;
    filteredCollection = collection;
    }

  // pagination logic, pagesize logic
async function updatePageSize() {
    currentPage.set(1);
    goto(`/collect?page=${$currentPage}&search=${$searchTerm}&page_size=${$pageSize}`);
}
  
async function changePage(newPage) {
    if (newPage >= 1 && newPage <= Math.ceil(filteredCollection.length / $pageSize)) {
      currentPage.set(newPage);
      notification.set(`you are on page ${$currentPage}`);

    }
    else {
      notification.set(`there is nothing to seek there`);
  }
}

async function searchIngredients() {
    currentPage.set(1);
    if ($searchTerm === "") {
      notification.set("")
    } else {
      notification.set(`Searching for ${$searchTerm}...`);
    }
    goto(`/collect?page=${$currentPage}&search=${$searchTerm}&page_size=${$pageSize}`);
  }

// delete ingredient, custom or otherwise
     /**
     * @param {MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }} ingredient
     */
     async function handleDeleteClick(ingredient) {
        const response = await deleteFromCollection(ingredient);
        console.log("Handler response:", response)
        try {
          console.log("success deleting ingredient:", response)
        filteredCollection = filteredCollection.filter(ingredientInside => ingredientInside.id !== ingredient.id);
        notification.set(response);
        editingRowId = null;
      } catch(error) {
        console.error("Error deleting ingredient:", error);
        notification.set(er);
      }
}

// editing functionality
    const editableFields = {
  CollectionIngredient: ["colour", "impression", "amount", "ideas", "associations"],
  CustomCollectionIngredient: ["common_name", "cas", "volatility", "use", "colour", "impression", "amount"]
};

    /**
     * @param {PropertyKey} ingredientType
     * @param {string} fieldName
     */
function isEditableField(ingredientType, fieldName) {
  if (editableFields.hasOwnProperty(ingredientType)) {
    return editableFields[ingredientType].includes(fieldName);
  } else {
    return false;
  }
}  

     /**
     * @param {{object: any;}} ingredient
     */
function toggleEdit(ingredient) {
    
    isEditing = !isEditing;
    editingRowId = editingRowId === ingredient.id ? null : ingredient.id;
    editingObject = editingObject === ingredient ? null : ingredient;
  }
   
async function saveEdit(ingredientToSave) {
  try {
    const response = await saveEditedIngredientCollect(ingredientToSave);
    
    toggleEdit(ingredientToSave);
    collection = await handleFetch(true);

  } catch (error) {
    console.error("Error saving edited ingredient:", error);
  }
}

function handleKeydown(event) {
    // Handle global key presses like Escape first
    if (event.key === 'Escape') {
        if (isEditing) {
            // Priority given to exiting editing mode
            event.preventDefault();
            
            toggleEdit(editingObject);
            return;
        }
        if (document.activeElement === searchInput) {
            // Clear search if it's focused
            searchTerm.set('');
            searchCollection();
            searchInput.blur();
            event.preventDefault();
            return;
        }
        if (isModalVisible) {
            // Close modal if it's visible
            event.preventDefault();
            toggleModal();
            return;
        }
        // Add more global Escape conditions here if necessary
    }

    // Specific contextual key handling below
    if (isEditing && event.key === "Enter") {
        event.preventDefault();
        saveEdit(editingObject);
        return;
    }

    if (!isEditing) { // Only allow these keys when not editing
        switch (event.key) {
            case '/':
                event.preventDefault();  // Toggle focus on search input
                if (document.activeElement === searchInput) {
                    searchInput.blur();
                } else {
                    searchInput.focus();
                }
                break;
            case 'ArrowLeft':
            case 'ArrowUp': // Combine up and left as they do the same thing
                event.preventDefault();
                changePage($currentPage - 1);
                break;
            case 'ArrowRight':
            case 'ArrowDown': // Combine down and right as they do the same thing
                event.preventDefault();
                changePage($currentPage + 1);
                break;
        }
    }
}


  // logic for creating a custom ingredient
function toggleModal() {
    isModalVisible = !isModalVisible;
  }

  let newCustomCommonName = '';
  let newCustomCas = '';
  let newCustomVolatility = '';
  let newCustomUse ='';

async function handleCreateCustomIngredient() {
    const newCustom = {
    common_name: newCustomCommonName,
    cas: newCustomCas,
    volatility: newCustomVolatility,
    use: newCustomUse,
    colour: '',
    impression: '',
    ideas: '',
    associations: '',
    amount: 0,
    unit: 'g'
  };
    try {
      const response = await createCustomIngredientCollect(newCustom);
      
      handleFetch(true);
      toggleModal();
    } catch (error) {
      console.error("Error creating custom ingredient:", error);
    }
  }

function cancelCreate() {
    newCustomCommonName = '';
    newCustomCas = '';
    newCustomVolatility = '';
    newCustomUse ='';
    toggleModal();
  }

    let tuneMenuVisible = false
    function toggleTuneMenu() {
        tuneMenuVisible = !tuneMenuVisible;
    }


// field visibility logic
function toggleFieldVisibility(field) {
  field.visible = !field.visible;
  visibleFields.update(fields => [...fields]); 
}


const searchCollection = () => {
  
  filteredCollection = collection.filter(ingredient => {
    const commonName = ingredient.common_name || '';
    const cas = ingredient.cas || '';
    console.log(commonName, cas)
    return commonName.toLowerCase().includes($searchTerm.toLowerCase()) ||
           cas.toLowerCase().includes($searchTerm.toLowerCase());
  });
  return filteredCollection;
};
  

// Compute the start index for slicing the array based on the current page and page size
$: {
  startIndex = ($currentPage - 1) * $pageSize;
}

let totalPages:number;

$: {
  try {
    paginatedCollection = filteredCollection.slice(startIndex, startIndex + $pageSize);
    totalPages = Math.ceil(filteredCollection.length / $pageSize);
  } catch (error) {
    notification.set("hm");
  }
  
}


onMount( async () => {
    let is_authenticated = sessionStorage.getItem("is_authenticated");
    if (is_authenticated === "false" || is_authenticated === null) {
      window.location.href = "/auth/login";
    } else {
      // This block should only execute if we're certain window is defined.
    currentPage.set((parseInt(sessionStorage.getItem('currentPageCollect')) || 1));
    pageSize.set((parseInt(localStorage.getItem('pageSizeCollect')) || 10));
    searchTerm.set((sessionStorage.getItem('searchTermCollect') || ""));
    visibleFields.set(JSON.parse(sessionStorage.getItem('visibleFieldsCollect')) || initialVisibleFields);
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

    visibleFields.subscribe(value => {
      
      sessionStorage.setItem('visibleFieldsCollect', JSON.stringify(value));
    });
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeydown);
    }
  });

</script>

<svelte:window on:keydown={handleKeydown}/>
<svelte:head>
  <title>BCF | Collect</title>
</svelte:head>

<div class="flex flex-col min-h-screen" style="background: url('/assets/bg/bbblurry-collect.svg') no-repeat center center fixed; background-size: cover;">
  <Header currentPage="collect" notification = {notification}/>
  <div class="mb-auto">
<div id = "app" class="flex flex-col items-center content-center lowercase font-light w-full text-rose-950/90 dark:text-rose-200/80">

  <div id="tools" class="flex flex-row w-full justify-center space-x-2">
    {#if isModalVisible === false}


      <div id="search-bar" class="flex flex-row w-1/2 justify-between space-x-2">
        {#if $currentPage > 1}
  <button id="prevPage" class="pl-2"on:click={() => changePage($currentPage-1)}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 hover:text-green-600/90 active:scale-90 dark:hover:text-green-600/90 transition-all hover:scale-110 hover:-transtone-x-2 duration-300">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  </button>
  {/if}
        
        <button on:click={toggleTuneMenu}
        title="tune the table to your liking"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 active:scale-90 hover:text-green-600/90 dark:hover:text-green-600/90 transition-all hover:scale-110">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
  
          
        </button>
        {#if tuneMenuVisible}
        <div id="tune-menu" class="flex flex-row w-full p-2 border border-none bg-white/20 dark:bg-black/20 space-y-2 items-center rounded-lg divide-x-2 lg:text-base md:text-sm sm:text-xs">
          <div class="w-1/3">
            <label class='flex px-2 items-center md:text-md sm:text-sm md:flex-col lg:flex-row'> 
              per page:
              <input type="number" class='flex border-none bg-white/20 dark:bg-black/20 ml-2 w-1/2 focus:ring-green-600/70 focus:ring-2 rounded-lg' min="1" bind:value={$pageSize} on:change={updatePageSize}/>
            </label>
              
              </div>
              
              <div id="visibility" class="grid lg:grid-cols-2 sm:grid-cols-1">
                {#each $visibleFields.slice(1) as field}
                <div class="flex flex-row items-center">
                  <input class=" mx-4 my-2 size-4 rounded-full shadow border-none text-green-600/90 focus:ring-green-600/30 checked:bg-green-600/70 active:scale-90 checked:ring-green-600/30 hover:checked:bg-green-600/80 transition-all hover:scale-110" type="checkbox" id={field.name} 
                  bind:checked={field.visible} 
                  on:click={() => toggleFieldVisibility(field)} />
                  <label for={field.name}>{field.name}</label>
                  </div>
                {/each}
              </div>
            </div>
          {:else if tuneMenuVisible === false}
            <input
          type="text"
          class = "flex w-full p-2 md:text-md lg:text-base bg-white/20 border-none dark:bg-black/20 shadow rounded-lg focus:ring-2 focus:ring-green-600/70 focus:border-green-900/70 focus:scale-95 transition-all"
          bind:value={$searchTerm}
          bind:this = {searchInput}
          on:input = {searchCollection}
          placeholder="/ search..."
          title="find an ingredient by CAS or the multiple names that it has"
        />
          {/if}
        
        <button on:click={searchIngredients}
        title="search for an ingredient by name or CAS"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-green-600/90 active:scale-90 dark:hover:text-green-600/90 transition-all hover:scale-110">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          
        </button>
        <button on:click={reset} title="reset everything">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-green-600/90 active:scale-90 dark:hover:text-green-600/90 transition-all hover:scale-110">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          
        </button>
      </div>
      <button on:click={toggleModal} title="add a new ingredient. nobody but you will see it">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-green-600/90 active:scale-90 dark:hover:text-green-600/90 transition-all hover:scale-110">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
      {#if filteredCollection.length !== 0 && totalPages > $currentPage}
  <button id="nextPage"class="pr-2" 
  on:click={() => changePage($currentPage+1)}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 hover:text-green-600/90 active:scale-90 dark:hover:text-green-600/90 transition-all hover:scale-110 hover:transtone-x-2 duration-300">
      <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  </button>
  {/if}
      
    {:else if isModalVisible}
      <div id="modal" class="flex bg-white/20 border-none dark:bg-black/20 rounded-lg p-6 text-xs">
        <form id="new_ingredient" class="grid grid-cols-2 gap-1">
          <input class="focus:ring-green-600/70 md:text-md lg:text-base focus:ring-2 rounded-lg border-none" bind:value={newCustomCommonName} placeholder="name" />
          <input class="focus:ring-green-600/70 md:text-md lg:text-base focus:ring-2 rounded-lg border-none" bind:value={newCustomCas} placeholder="CAS" />
          <input class="focus:ring-green-600/70 md:text-md lg:text-base focus:ring-2 rounded-lg border-none" bind:value={newCustomVolatility} placeholder="volatility" />
          <input class="focus:ring-green-600/70 md:text-md lg:text-base focus:ring-2 rounded-lg border-none" bind:value={newCustomUse} placeholder="use" />
        </form>
        <div class="flex flex-col space-y-2 p-2">
          <button on:click={handleCreateCustomIngredient}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-green-600/90 active:scale-90 dark:hover:text-green-600/90 transition-all hover:scale-110">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>            
          </button>
          <button on:click={cancelCreate}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-green-600/90 active:scale-90 dark:hover:text-green-600/90 transition-all hover:scale-110">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            
          </button>
          <button on:click={toggleModal}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-green-600/90 active:scale-90 dark:hover:text-green-600/90 transition-all hover:scale-110">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          </button>
      </div>
      </div>
    {/if}
   
  </div>
  



<div id="table-wrapper" class="flex flex-row ml-6 mr-6 mt-0 p-2 overflow-x-auto overflow-y-auto text-sm items-center">
{#if isLoading}
<Loader />
{:else if collection.error}
          <!-- If there is an error fetching data, display the error message -->
          <p>{collection.error}</p>
        {:else}
  {#if editingRowId !== null}
<button id="saveEdit" class="pl-2" on:click={() => saveEdit(editingObject)}>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-24 hover:text-green-600/90 active:scale-90 dark:hover:text-green-600/90 transition-all hover:scale-110">
    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
</button>
  

  {/if}
    
  <div id="table bg" class="shadow rounded-lg p-4 mt-4 flex items-center flex-col bg-gradient-to-br from-rose-300/10 to-rose-500/10"

  transition:blur={{duration:150}}
  >
  <table class="shadow bg-blend-overlay size-full table-fixed text-sm border-collapse overflow-hidden bg-gradient-to-br from-rose-50/90 to-rose-100/30 dark:from-rose-900/20 dark:to-rose-950/20 rounded-lg"
  transition:fade={{delay:50, duration:150}}
  >
  <thead class="rounded-lg bg-gradient-to-r from-rose-800/40 to-rose-800/30 text-rose-900/90 dark:text-rose-400/90 space-x-2 h-10 text-xl tracking-widest align-middle text-center md:text-base sm:text-sm lg:text-lg">
    <tr>
      {#each $visibleFields as header}
        {#if header.name === "use" && header.visible}
          <th class="align-middle w-1/4">use</th>
          {:else if header.name === "common_name" && header.visible}
          <th class="align-middle w-1/4 rounded-tl-lg">ingredient</th>
          {:else if header.name === "amount" && header.visible}
          <th class="align-middle w-1/6 rounded-tr-lg">
            <div id="icon container" class="flex align-middle justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
            </svg>            
          </div>
          </th>
          {:else if header.name === "colour" && header.visible}
          <th class="align-middle w-1/6">
            <div id="icon container" class="flex align-middle justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />
              </svg>
            </div>   
          </th>           
          {:else if header.visible}
          <th class="align-middle">
            {header === $visibleFields[0] ? 'ingredient' : header.name}
          </th>
        {/if}
      {/each}
    </tr>
    
  </thead>
  


  <tbody class="text-center divide-y-4 divide-double divide-rose-900/30 dark:divide-rose-200/20 rounded-lg ">
  
  {#each paginatedCollection as ingredient}
    <tr on:dblclick={() => toggleEdit(ingredient)} 
      title="double click to edit"
      
      class="hover:text-rose-700 odd:bg-stone-50 even:bg-stone-100 dark:odd:bg-stone-950 dark:even:bg-stone-900 divide-x-4 divide-double divide-green-900/10 dark:divide-green-200/10 transition-all duration-300">

      {#each $visibleFields as field, index}
  {#if field.visible}
    <td class="align-middle m-4 p-4 {index === 0 ? 'tracking-tight font-extrabold text-ellipsis text-balance dark:bg-rose-900/20 bg-rose-200/20' : ''}">
      {#if isEditableField(ingredient.type, field.name) && editingRowId === ingredient.id}
        <textarea
          rows="3"
          class="bg-stone-50/20 dark:bg-stone-950/20 text-center border-none font-light flex w-full focus:ring-green-600/70 focus:ring-2 rounded-lg"
          bind:value={ingredient[field.name]}
          placeholder="{field.name}"
          
        />
      {:else if field.name === "amount"}
          {ingredient[field.name]} {ingredient.unit}
      {:else}
        <div id="icon container" class="flex align-middle justify-center">
          {@html ingredient[field.name] || ` 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 hover:text-green-600/90 active:scale-90 dark:hover:text-green-600/90 transition-all hover:scale-110">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
</svg>x2
`
          }
        </div>
      {/if}
    </td>
  {/if}
{/each}

    </tr>
  {/each}
  
</tbody>

  </table>
  {#if filteredCollection.length === 0}
  <div class="flex justify-center items-center w-full m-20 text-2xl text-center">
    <p class="flex items-center justify-center gap-2.5"> <!-- Added gap for spacing between text and SVG -->
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-12">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
      
        no ingredients found. 
        try adding more on the <a href="/browse" class= "text-sky-400">browse</a> page!
    </p>
</div>


  {/if}  
  
</div>

  {#if editingRowId !== null}
<button on:click={() => handleDeleteClick(editingObject)} class="pl-2">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-24 hover:text-red-600/90 active:scale-90 dark:hover:text-red-600/90 transition-all hover:scale-110">
    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
</button>
    {/if}
    
  {/if}
</div>
</div>

</div>
<Footer />
</div>
