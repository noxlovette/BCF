<script>
  import { onMount } from "svelte";
  import { fetchDataFromDjango } from "$lib/DjangoAPI.ts";
    import Header from "$lib/components/Header.svelte";
    import { fade } from "svelte/transition";
    import { writable } from "svelte/store";
    import Footer from "$lib/components/Footer.svelte";
    import { goto } from '$app/navigation';


  let userId = 0;
  /**
     * @type {any[]}
     */
  let ingredients = [];
  if (typeof window !== "undefined") {
    userId = window.sessionStorage.getItem("user_id");
  }
  
  onMount(async () => {
    // redirect the user the hell out of here if they are not authenticated. TODO add to all pages
    let is_authenticated = sessionStorage.getItem("is_authenticated");
  if (is_authenticated === "false" || is_authenticated === null) {
    window.location.href = "/auth/login";
  }
    fetchIngredients();
    isLoading = false;
  });


  let pageSize = 10;
  let currentPage = 1;
  let searchTerm = "";

  async function fetchIngredients() {
    console.log("Fetching ingredients...");
    let url = `http://localhost:8000/collection/api/collection/${userId}/?page=${currentPage}&search=${searchTerm}&page_size=${pageSize}`;
    let response = await fetchDataFromDjango(url);
    const data = response.results;

    ingredients = Array.isArray(data) ? data : [data];
    ingredients = ingredients.map((ingredient) => ({
      ...ingredient,
      
    }
  ));
  isEditing: false;
  }

  async function updatePageSize() {
    currentPage = 1;
    const url = `/collect?page=${currentPage}&search=${searchTerm}&page_size=${pageSize}`;
    goto(url);
    data = await fetchIngredients(); // Wait for the URL to be updated before loading new data
}
  
async function prevPage() {
    if (currentPage > 1) {
    currentPage--;
    notification.set(`you are on page ${currentPage}`);
    goto(`/collect?page=${currentPage}&search=${searchTerm}`);
    data = await fetchIngredients();
  }
    
  }

  async function nextPage() {
    currentPage++;
    notification.set(`you are on page ${currentPage}`);
    goto(`/collect?page=${currentPage}&search=${searchTerm}`);
    const data = await fetchIngredients();
  }
    
    async function reset() {
      searchTerm = "";
    currentPage = 1;
    goto(`/collect?page=${currentPage}&search=${searchTerm}`);
    const data = await fetchIngredients();
    isEditing: false;
    }


async function handleSearch(event) {
    if (event.key === 'Enter') {
      searchIngredients();
    }
  }

  async function searchIngredients() {
    currentPage = 1;
    notification.set(`Searching for ${searchTerm}...`);
    goto(`/collect?page=${currentPage}&search=${searchTerm}`);
    data = await fetchIngredients();
  }

  // delete ingredient, custom or otherwise

  
     /**
     * @param {MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }} ingredient
     */
     async function handleDeleteClick(ingredient) {
    let url;
    if (ingredient.type === "CollectionIngredient") {
        url = `http://localhost:8000/collection/api/ingredient/${userId}/${ingredient.id}/delete/`;
    } else if (ingredient.type === "CustomCollectionIngredient") {
        url = `http://localhost:8000/collection/api/ingredient/${userId}/custom/${ingredient.id}/delete/`;
    }
    try {
        const response = await fetchDataFromDjango(url, "DELETE");
        console.log("Response:", response);
        notification.set("Ingredient deleted");
        fetchIngredients();
    } catch (error) {
        console.error("Error deleting ingredient:", error);
        notification.set("Error deleting ingredient");
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
  // Check if the ingredient type exists in the editableFields dictionary
  if (editableFields.hasOwnProperty(ingredientType)) {
    // If the field name is included in the list of editable fields for the ingredient type, return true
    return editableFields[ingredientType].includes(fieldName);
  } else {
    // If the ingredient type is not found in the dictionary, default to false
    return false;
  }
}

  let editingObject = null;
  let editingRowId = null;
     /**
     * @param {{object: any;}} ingredient
     */
     function toggleEdit(ingredient) {
      console.log("Toggling edit for ingredient:", ingredient);
    editingRowId = editingRowId === ingredient.id ? null : ingredient.id;
    editingObject = editingObject === ingredient ? null : ingredient;
  }
  


  /**
     * @param {{ common_name: any; cas: any; volatility: any; use: any; colour: any; impression: any; is_collection: any; amount: number; unit: any; type: string; id: any; ideas: string; associations: string; }} ingredientToSave
     */
     async function saveEdit(ingredientToSave) {
    // Collect the data from the input fields
    const data = {
      common_name: ingredientToSave.common_name,
      cas: ingredientToSave.cas,
      volatility: ingredientToSave.volatility,
      use: ingredientToSave.use,
      colour: ingredientToSave.colour,
      impression: ingredientToSave.impression,
      ideas: ingredientToSave.ideas,
      associations: ingredientToSave.associations,
      amount: ingredientToSave.amount,
      unit: ingredientToSave.unit,
    };

    // Define the URL for the PUT request
    let url;
    if (ingredientToSave.type === "CollectionIngredient") {
      url = `http://localhost:8000/collection/api/ingredient/${userId}/${ingredientToSave.id}/update/`;
    } else if (ingredientToSave.type === "CustomCollectionIngredient") {
      url = `http://localhost:8000/collection/api/ingredient/${userId}/custom/${ingredientToSave.id}/update/`;
    }

    // Send the PUT request to the server
    try {
      const response = await fetchDataFromDjango(url, "PUT", data);
      console.log("Response:", response);
      // Fetch the updated ingredients
      fetchIngredients();
    } catch (error) {
      console.error("Error saving edited ingredient:", error);
    }

    toggleEdit(ingredientToSave);
  }




  // logic for creating a custom ingredient

  let common_name = '';
  let cas = '';
  let volatility = '';
  let use ='';
  let colour ='';
  let associations ='';
  let ideas ='';
  let impression ='';
  let amount = 0;

  let isModalVisible = false;

  function toggleModal() {
    isModalVisible = !isModalVisible;
  }

  async function createCustomIngredient() {
    // Collect the data from the input fields
    const data = {
      common_name,
      cas,
      volatility,
      use,
      colour,
      impression,
      associations,
      ideas,
      amount,
      unit: "g",
    };

    // Define the URL for the POST request
    const url = `http://localhost:8000/collection/api/ingredient/${userId}/new/`;

    // Send the POST request to the server
    try {
      const response = await fetchDataFromDjango(url, "POST", data);
      console.log("Response:", response);
      // Fetch the updated ingredients
      fetchIngredients();
      hideModal();
    } catch (error) {
      console.error("Error creating custom ingredient:", error);
    }
  }

  function cancelCreate() {
    common_name = '';
    cas = '';
    volatility = '';
    use ='';
    toggleModal();
  }

// logic for searching ingredients and tools functionality


    let tuneMenuVisible = false
    function toggleTuneMenu() {
        tuneMenuVisible = !tuneMenuVisible;
    }

    function toggleFieldVisibility(field) {
  console.log('Before toggle:', field, $visibleFields); // log the state before the toggle

  field.visible = !field.visible;
  visibleFields.update(fields => [...fields]); 
  

  console.log('After toggle:', field, $visibleFields); // log the state after the toggle
}

// logic for the tune menu

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



// logic for the notification, loading

    let notification = writable("");

    let isLoading = true;

    $: if (isLoading) {
    notification.set('Loading...');
  } else {
    notification.set('');
  }

    

</script>

<div class="flex flex-col min-h-screen" style="background: url('/assets/bg/bbblurry-collect.svg') no-repeat center center fixed; background-size: cover;">
  <Header currentPage="collect" notification = {notification}/>
  <div class="mb-auto">
<div id = "app" class="flex flex-col content-center lowercase font-light w-full text-rose-900/90 dark:text-rose-200/80">

  <div id="tools" class="flex flex-row w-full justify-center space-x-2">
    <div id="search-bar" class="flex flex-row w-1/2 justify-between space-x-2">
      
      <button on:click={toggleTuneMenu}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-green-700/90 dark:hover:text-green-600/90">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>

        
      </button>
      {#if tuneMenuVisible}
      <div id="tune-menu" class="flex w-full p-2 border-slate-400 bg-white/20 dark:bg-black/20 space-y-2 top-10 justify-start align-middle text-sm rounded-lg">
        <div class="flex flex-row align-middle justify-start">
          <label class='flex items-center'> 
            page size:
            <input type="number" class='flex border-slate-400 bg-white/20 dark:bg-black/20 pl-2 ml-4 w-20 focus:ring-green-700/70 focus:ring-2 rounded-lg' min="1" bind:value={pageSize} on:change={updatePageSize}/>
          </label>
            
            </div>
            
            <div id="visibility" class="grid grid-cols-3">
              {#each $visibleFields.slice(1) as field}
              <div class="flex flex-row space-x-2 ml-2">
                <input class="size-4 rounded-full shadow border-slate-400 text-green-700/90 focus:ring-green-700/30 checked:bg-green-700/70 checked:ring-green-700/30 hover:checked:bg-green-700/80" type="checkbox" id={field.name} bind:checked={field.visible} on:click={() => toggleFieldVisibility(field) && console.log("clicked")} />
                <label for={field.name}>{field.name}</label>
                </div>
              {/each}
            </div>
          </div>
        {:else if tuneMenuVisible === false}
          <input
        type="text"
        class = "flex w-full p-2 bg-white/20 border-slate-400 dark:bg-black/20 shadow rounded-lg focus:ring:2 focus:ring-green-700/70 focus:border-green-900/70"
        bind:value={searchTerm}
        on:keydown={handleSearch}
        placeholder="search..."
        title="find an ingredient by CAS or the multiple names that it has"
      />
        {/if}
      
      <button on:click={searchIngredients}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-green-700/90 dark:hover:text-green-600/90">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        
      </button>
      <button on:click={reset} title="Reset the search field">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-green-700/90 dark:hover:text-green-600/90">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        
      </button>
    </div>
    <button on:click={toggleModal} title="add a new ingredient. nobody but you will see it">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-green-700/90 dark:hover:text-green-600/90">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>
      
    {#if isModalVisible}
      <div id="modal" class="flex bg-white/20 border-slate-400 dark:bg-black/20 rounded-lg p-6 text-xs">
        <form id="new_ingredient" class="grid grid-cols-2 gap-1">
          <input class="focus:ring-green-700/70 focus:ring-2 rounded-lg border-slate-400" bind:value={common_name} placeholder="name" />
          <input class="focus:ring-green-700/70 focus:ring-2 rounded-lg border-slate-400" bind:value={cas} placeholder="CAS" />
          <input class="focus:ring-green-700/70 focus:ring-2 rounded-lg border-slate-400" bind:value={volatility} placeholder="volatility" />
          <input class="focus:ring-green-700/70 focus:ring-2 rounded-lg border-slate-400" bind:value={use} placeholder="use" />
        </form>
        <div class="flex flex-col space-y-2 p-2">
          <button on:click={createCustomIngredient}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-green-700/90 dark:hover:text-green-600/90">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>            
          </button>
          <button on:click={cancelCreate}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-green-700/90 dark:hover:text-green-600/90">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            
          </button>
          <button on:click={toggleModal}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-green-700/90 dark:hover:text-green-600/90">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          </button>
      </div>
      </div>
    {/if}
   
  </div>
  


  {#if isLoading}
          <!-- If isLoading is true, display a loading message -->
          <p></p>
        {:else}
<div id="table-wrapper" class="flex flex-row ml-6 mr-6 mt-0 p-2 overflow-x-auto overflow-y-auto text-sm items-center"
>

  {#if editingRowId !== null}
<button class="pl-2"on:click={saveEdit(editingObject)}>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-24 hover:text-green-700/90 dark:hover:text-green-600/90">
    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
</button>
  
  {:else}
  <button class="pl-2"on:click={prevPage}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-24 hover:text-green-700/90 dark:hover:text-green-600/90">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  </button>
  {/if}
    
  <div id="table bg" class="rounded-lg p-4 mt-4 flex bg-gradient-to-br from-rose-300/20 to-rose-500/20">
  <table class="shadow bg-blend-overlay size-full table-fixed text-sm border-collapse overflow-hidden bg-gradient-to-br from-rose-50/90 to-rose-100/30 dark:from-rose-950/60 dark:to-rose-900/50 rounded-lg">
  <thead class="rounded-lg bg-gradient-to-r from-rose-800/30 to-rose-100/30 text-rose-900/90 dark:text-rose-400/90 space-x-2 h-10 text-xl tracking-widest align-middle text-center" style="background: rgb(157 23 77 / 0.3) url('/assets/bg/texture/nnnoise.svg') no-repeat; background-size:cover;">
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
  
  <tbody class="text-center divide-y-4 divide-double divide-rose-900/10 dark:divide-rose-200/10 rounded-lg">
  {#each ingredients as ingredient}
    <tr on:dblclick={() => toggleEdit(ingredient)} class="hover:bg-green-700/10 dark:hover:bg-green-300/10 divide-x-4 divide-double divide-green-900/10 dark:divide-green-200/10">

      {#each $visibleFields as field, index}
  {#if field.visible}
    <td class="align-middle m-4 p-4 {index === 0 ? 'text-2xl font-thin' : ''}">
      {#if isEditableField(ingredient.type, field.name) && editingRowId === ingredient.id}
        <textarea
          type="text"
          rows="3"
          class="bg-white/20 dark:bg-black/20 text-center font-light flex w-full focus:ring-green-700/70 focus:ring-2 rounded-lg"
          bind:value={ingredient[field.name]}
          placeholder="{field.name}"
          on:keydown={(event) => {
            if (event.key === "Enter") {
              saveEdit(ingredient);
            }
          }}
        />
      {:else if field.name === "amount"}
          {ingredient[field.name]} {ingredient.unit}
      {:else}
        <div id="icon container" class="flex align-middle justify-center">
          {@html ingredient[field.name] || `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 hover:text-green-700/90 dark:hover:text-green-600/90">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>`
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
</div>

  {#if editingRowId !== null}
<button on:click={() => handleDeleteClick(editingObject)} class="pl-2">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-24 hover:text-green-700/90 dark:hover:text-green-600/90">
    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
  
  
  
</button>

  {:else}
  <button class="pr-2" on:click={nextPage}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-24 hover:text-green-700/90 dark:hover:text-green-600/90">
      <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>


  </button>
    {/if}
    
    
  

  
  </div>
  {/if}
</div>
  

</div>
<Footer />
</div>
