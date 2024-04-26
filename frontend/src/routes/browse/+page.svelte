<script>
// @ts-nocheck

  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { fetchDataFromDjango } from "$lib/DjangoAPI.ts";
    import Header from "$lib/components/Header.svelte";
    import { writable } from "svelte/store";
    import {fade} from "svelte/transition";

  export let data;
  export let currentPage = 1;
  export let searchTerm = "";

  let isLoading = true;

  let notification = writable("");

  onMount(async () => {
    // Set currentPage and searchTerm based on the initial props
    currentPage = Math.floor(Math.random() * 100) + 1;
    searchTerm = "";
    data = await load();
    isLoading = false; // Set loading state to false after data is fetched
  });

  $: if (isLoading) {
    notification.set('Loading...');
  } else {
    notification.set('');
  }

  async function load() {
    return await fetchIngredients(currentPage, searchTerm);
  }

  async function reset() {
    searchTerm = "";
    currentPage = Math.floor(Math.random() * 100) + 1;
    goto(`/browse?page=${currentPage}&search=${searchTerm}`);
    data = await load();
  }

  /**
   * @param {number} currentPage
   */
  async function fetchIngredients(currentPage, searchTerm = "") {
    try {
      const endpoint = `http://localhost:8000/browse/api/ingredients?page=${currentPage}&search=${searchTerm}&page_size=${pageSize}`;
      const ingredientsData = await fetchDataFromDjango(endpoint);
      console.log("Data from Django:", ingredientsData);
      return ingredientsData;
    } catch (error) {
      console.error("Error fetching data from Django:", error);
      return {
        error: "Failed to fetch ingredients data",
      };
    }
  }

  /**
     * @param {any} ingredientId
     */
     async function addToCollection(ingredientId) {
  try {
    const userId = sessionStorage.getItem("user_id");
    const endpoint = `http://localhost:8000/collection/api/collection/${userId}/`;
    const body = { user_id: userId, ingredient_id: ingredientId };
    // @ts-ignore
    const response = await fetchDataFromDjango(endpoint, "POST", body);

    if (response.success) {
      notification.set("Ingredient successfully added to collection!");
    } else {
      console.error(response.error);
      // If the Django API returns an error message, it will be in response.error
      notification.set(response.error);
    }
  } catch (error) {
    console.error("Error adding ingredient to collection:", error);
    // If the error is an instance of Error, the message will be in error.message
    notification.set(error.message);
  }
}

  async function searchIngredients() {
    currentPage = 1;
    notification.set(`Searching for ${searchTerm}...`);
    goto(`/browse?page=${currentPage}&search=${searchTerm}`);
    data = await load();
  }

  function handleSearch(event) {
    if (event.key === 'Enter') {
      searchIngredients();
    }
  }

  async function prevPage() {
    if (currentPage > 1) {
    currentPage--;
    notification.set(`Navigating to page ${currentPage}`);
    goto(`/browse?page=${currentPage}&search=${searchTerm}`);
    data = await load();
  }
    
  }

  async function nextPage() {
    currentPage++;
    notification.set(`Navigating to page ${currentPage}`);
    goto(`/browse?page=${currentPage}&search=${searchTerm}`);
    data = await load();
  }

let pageSize = 10;
let showTuneMenu = false;
let columns = writable([
  { name: "common_name", label: "Common Name", visible: true },
  { name: "cas", label: "CAS", visible: true },
  { name: "volatility", label: "Volatility", visible: true },
  { name: "descriptors", label: "Descriptors", visible: true },
  { name: "use", label: "Use", visible: true },
  { name: "is_restricted", label: "Is Restricted", visible: true },
  { name: "origin", label: "Origin", visible:false}
]);

function toggleTuneMenu() {
  console.log("Tuning menu...");
  showTuneMenu = !showTuneMenu;
}

function toggleColumn(column) {
  column.visible = !column.visible;
}

async function updatePageSize() {
    currentPage = 1;
    const url = `/browse?page=${currentPage}&search=${searchTerm}&page_size=${pageSize}`;
    goto(url);
    data = await load(); // Wait for the URL to be updated before loading new data
}


</script>

<Header currentPage="browse" notification = {notification}/>

<div id = "app" class="flex flex-col items-center mt-0 lowercase">
  <div id="tools" class="flex flex-row w-full justify-between space-x-2">
    <button class="pl-2"on:click={prevPage}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
      </svg>
      
    </button>
    <div id="search-bar" class="flex flex-row w-1/2 justify-between space-x-2">
      {#if showTuneMenu}
    <div class="relative bg-white size-10 z-20">
    <div class=''>
      <span class="material-icons">list</span>
      <input type="number" class = 'flex' min="1" bind:value={pageSize} on:change={updatePageSize}/>
      
    </div>

    <div>
      {#each $columns as column}
        <label>
          <input type="checkbox" bind:checked={column.visible} on:change={() => toggleColumn(column)} />
          {column.label}
        </label>
      {/each}
    </div>
  </div>
  {/if}
      <button on:click={toggleTuneMenu}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>
        
      </button>
      <input
        type="text"
        class = "flex w-full p-2"
        bind:value={searchTerm}
        on:keydown={handleSearch}
        placeholder="search..."
        title="Find an ingredient by CAS or the multiple names that it might have"
      />
      <button on:click={searchIngredients}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        
      </button>
      <button on:click={reset} title="Reset the search field">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        
      </button>
    </div>
    <button class="pr-2" on:click={nextPage}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
      </svg>
      
    </button>
  </div>

  <div id="table-wrapper" class="ml-8 mr-8 mt-0 p-2 w-screen overflow-x-auto overflow-y-auto text-sm">
    {#if isLoading}
      <!-- If isLoading is true, display a loading message -->
      <p>Loading...</p>


      {:else if data.error}
      <!-- If there is an error fetching data, display the error message -->
      <p>{data.error}</p>
      {:else if data.results.length === 0}
      <!-- If there are no results, display a message -->
      <p>Loading...</p>
    {:else}
      <!-- Once data is fetched, render the #each block -->
      <table class="bg-blend-screen size-full table-fixed">
        <thead class="bg-amber-100">
          <tr>
            <th class="w-1/4">common name</th>
            <th class="w-min-fit">CAS</th>
            <th class="w-min-fit">descriptors</th>
            <th class="w-1/3">use</th>
            <th class="w-min-fit">volatility</th>
            <th class="w-min-fit max-w-sm">ifra</th>
            <th class="w-min-fit max-w-xs">add</th>
          </tr>
        </thead>
        <tbody class="text-center divide-y divide-dashed divide-amber-300" transition:fade={{duration: 500}}>

          {#each data.results as ingredient}
            <tr>
              <td title = "{ingredient.other_names}">{ingredient.common_name}</td>
              <td>{ingredient.cas}</td>
              
              
              
              <td>{ingredient.descriptors}</td>
              <td>
                {#if ingredient.use}
                {ingredient.use}
                {:else}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
                
                {/if}
            
              </td>

              <td>
                {#if ingredient.volatility}
                {ingredient.volatility}
                {:else}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
                
                {/if}

              </td>

              <td>
                {#if ingredient.is_restricted === "Yes"}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                
                {:else}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                
                {/if}
              
              </td>
              <td>
                <button on:click={() => addToCollection(ingredient.id)} title="Add this ingredient to your collection">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
  
</div>

