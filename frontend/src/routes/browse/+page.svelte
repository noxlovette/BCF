<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { fetchDataFromDjango } from "$lib/DjangoAPI.ts";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
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

let initialVisibleFields = [
  { name: "common_name", visible: true },
  { name: "cas", visible: false },
  { name: "volatility", visible: false },
  { name: "ingredient_type", visible: false},
  { name: "use", visible: true },
  { name: "descriptors", visible: false },
  { name: "origin", visible: true},
  { name: "constituents", visible: false},
  { name: "similar_ingredients", visible: true},
  { name: "is_restricted", visible: false },
  { name: "contributors", visible: false},
  { name: "actions", visible: true },
];
export let visibleFields = writable(initialVisibleFields);

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

<div class="flex flex-col min-h-screen z-0" style="background: url('/assets/bg/bbblurry-browse.svg') no-repeat center center fixed; background-size: cover;">
  <Header currentPage="browse" notification = {notification}/>
  <div class="mb-auto">
    <div id = "app" class="flex flex-col items-center mt-0 lowercase font-light text-sky-900/80 dark:text-sky-200/90">
      <div id="tools" class="flex flex-row w-full justify-center space-x-2">
        <div id="search-bar" class="flex flex-row w-1/2 justify-between space-x-2">
          
          <button on:click={toggleTuneMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-amber-400/90">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
            
          </button>
          {#if showTuneMenu}
        <div class="flex flex-row w-full p-2 bg-white/20 dark:bg-black/20 space-y-2 items-center rounded-lg">

          <label class="flex flex-row items-start">
            Page Size:
            <input type="number" class = 'flex bg-white/30 dark:bg-black/30 pl-2 ml-4 rounded-lg' min="1" bind:value={pageSize} on:change={updatePageSize}/>
          </label>
        </div>
        

      {:else if showTuneMenu === false}
          <input
            type="text"
            class = "flex w-full p-2 bg-white/20 dark:bg-black/20 rounded-lg"
            bind:value={searchTerm}
            on:keydown={handleSearch}
            placeholder="search..."
            title="Find an ingredient by CAS or the multiple names that it might have"
          />

          {/if}
          <button on:click={searchIngredients}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-amber-400/90">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            
          </button>
          <button on:click={reset} title="Reset the search field">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-amber-400/90">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            
          </button>
        </div>
        
      </div>
    
      <div id="table-wrapper" class="flex flex-row ml-8 mr-8 mt-0 p-2 overflow-x-auto overflow-y-auto text-sm items-center">
        
        
        {#if isLoading}
          <!-- If isLoading is true, display a loading message -->
          <div class="spinner" />
    
    
          {:else if data.error}
          <!-- If there is an error fetching data, display the error message -->
          <p>{data.error}</p>
          {:else if data.results.length === 0}
          <!-- If there are no results, display a message -->
          <div class="spinner" />
        {:else}

        <button class="pl-2"on:click={prevPage}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-24 hover:text-amber-400/90">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          
          
        </button>
          <!-- Once data is fetched, render the #each block -->
          <table class="bg-blend-screen size-full table-fixed border-collapse border-spacing-0">
            <thead class="bg-sky-600/30 h-8 dark:text-sky-300/80 text-xl text-sky-900/80" style="background: rgb(2 132 199 / 0.3) url('/assets/bg/texture/nnnoise.svg') no-repeat; background-size:cover;">
              <tr class="">
                <th class="w-1/4 rounded-tl-lg">common name</th>
                <th class="w-min-fit">CAS</th>
                <th class="w-min-fit">descriptors</th>
                <th class="w-1/3">use</th>
                <th class="w-min-fit">volatility</th>
                <th class="w-min-fit max-w-sm">ifra</th>
                <th class="w-min-fit max-w-xs rounded-tr-lg">
                  <div id="icon container" class="flex align-middle justify-center">

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                    </svg>

                  </div>

                </th>
              </tr>
            </thead>
            <tbody class="text-center divide-y divide-dashed divide-amber-700/50 dark:divide-amber-400/50 border-b-6 border-sky-600/30" transition:fade={{duration: 500}}>
    
              {#each data.results as ingredient}
                <tr on:dblclick={() => addToCollection(ingredient.id)} class="hover:bg-amber-400/10">
                  <td title = "{ingredient.other_names}" class="align-middle m-4 p-4 text-2xl font-thin rounded-l-lg">{ingredient.common_name}</td>
                  <td class="align-middle m-4 p-4">{ingredient.cas}</td>
                  
                  
                  
                  <td class="align-middle m-4 p-4">{ingredient.descriptors}</td>
                  <td class="text-pretty m-4 p-4">
                    {#if ingredient.use}
                    {ingredient.use}
                    {:else}
                    <div id="icon container" class="flex align-middle justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-amber-400/90">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                      </svg>
                    </div>
                   
                    
                    {/if}
                
                  </td>
    
                  <td class="align-middle m-4 p-4">
                    {#if ingredient.volatility}
                    {ingredient.volatility}
                    {:else}
                    

                    <div id="icon container" class="flex align-middle justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-amber-400/90">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                      </svg>

                    </div>
                    
                    
                    {/if}
    
                  </td>
    
                  <td class="align-middle m-4 p-4">
                    {#if ingredient.is_restricted === "Yes"}
                    <div id="icon container" class="flex align-middle justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-amber-400/90">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>


                    </div>
                    
                    
                    {:else}
                    <div id="icon container" class="flex align-middle justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-amber-400/90">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                    {/if}
                  
                  </td>
                  <td class="align-middle m-4 p-4 rounded-r-lg ">
                    <div id="icon container" class="flex align-middle justify-center h-full space-x-2">

                      <button on:click={() => addToCollection(ingredient.id)} title="Add this ingredient to your collection">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 hover:text-amber-400/90">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>

                        
                        
                      </button>
                      <button>

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-amber-400/90">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>


                      </button>

                    </div>
                    
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
          <button class="pr-2" on:click={nextPage}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-24 hover:text-amber-400/90">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            
            
          </button>
        {/if}
        
      </div>
      
    </div>
  
  </div>

  <Footer />
</div>



<style>

.spinner {
    border: 16px solid #f0f9ff;
    border-top: 16px solid #7dd3fc;
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
</style>