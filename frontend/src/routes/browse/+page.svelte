<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fetchDataFromDjango } from '$lib/DjangoAPI.js';

  export let data;
  export let currentPage = 1;
  export let searchTerm = '';

  let isLoading = true;

  onMount(async () => {
    // Set currentPage and searchTerm based on the initial props
    currentPage = 1;
    searchTerm = '';
    data = await load();
    isLoading = false; // Set loading state to false after data is fetched
  });

  async function load() {
    return await fetchIngredients(currentPage, searchTerm);
  }

  async function reset() {
    searchTerm = '';
    currentPage = 1;
    goto(`/browse?page=${currentPage}&search=${searchTerm}`);
    data = await load();
  }

  /**
   * @param {number} currentPage
   */
  async function fetchIngredients(currentPage, searchTerm = '') {
    try {
      const endpoint = `http://localhost:8000/browse/api/ingredients?page=${currentPage}&search=${searchTerm}`;
      const ingredientsData = await fetchDataFromDjango(endpoint);
      console.log('Data from Django:', ingredientsData);
      return ingredientsData;
    } catch (error) {
      console.error('Error fetching data from Django:', error);
      return {
        error: 'Failed to fetch ingredients data'
      };
    }
  }

  async function addToCollection(ingredientId) {
    try {
      const userId = sessionStorage.getItem('user_id');
      const endpoint = `http://localhost:8000/collection/api/collection/${userId}/`;
      const body = { user_id: userId, ingredient_id: ingredientId };
      const response = await fetchDataFromDjango(endpoint, 'POST', body);

      if (response.success) {
        alert('Ingredient successfully added to collection!');
      } else {
        console.error(response.error);
      }
    } catch (error) {
      console.error('Error adding ingredient to collection:', error);
    }
  }

  async function searchIngredients() {
    currentPage = 1;
    goto(`/browse?page=${currentPage}&search=${searchTerm}`);
    data = await load();
  }

  async function prevPage() {
    currentPage--;
    goto(`/browse?page=${currentPage}&search=${searchTerm}`);
    data = await load();
  }

  async function nextPage() {
    currentPage++;
    goto(`/browse?page=${currentPage}&search=${searchTerm}`);
    data = await load();
  }
</script>

<div class="flex flex-col items-center justify-center mt-0">
  <h1 class = "text-9xl font-thin">Browse</h1>
  <div id="tools">
    <div id="search-bar" class="flex items-center">
      <input type="text" bind:value={searchTerm} placeholder="Search..."
             title="Find an ingredient by CAS or the multiple names that it might have"/>
      <button on:click={searchIngredients}>
      <span class="material-icons">search</span>
      </button>
      <button on:click={reset} title="Reset the search field">
      <span class="material-icons">search_off</span>
      </button>
    </div>

    <div id="pagination" class="flex justify-between items-center">
      <button on:click={prevPage}>
        <span class="material-icons">arrow_back_ios</span>
      </button>
      <button on:click={nextPage}>
        <span class="material-icons">arrow_forward_ios</span>
      </button>
    </div>
  </div>

  <div id = 'table-wrapper' class="flex flex-auto items-center justify-center m-10 mt-0 p-2">
    {#if isLoading} <!-- If isLoading is true, display a loading message -->
      <p>Loading...</p>
    {:else} <!-- Once data is fetched, render the #each block -->
      <table class="flex-auto table-fixed border-separate border border-slate-600">
        <thead>
        <tr class="font-bold">
          <th class = "border-header">Add</th>
          <th class = "border-header">Common Name</th>
          <th class = "border-header">CAS</th>
          <th class = "border-header">Volatility</th>
          <th class = "border-header">Descriptors</th>
          <th class = "border-header">Use</th>
          <th class = "border-header">Is Restricted</th>
        </tr>
        </thead>
        <tbody>
        {#each data.results as ingredient (ingredient.id)}
          <tr>
            <td class="border-cell">
              <button on:click={() => addToCollection(ingredient.id)} class="flex items-center"
                      title="Add this ingredient to your collection">
                <span class="material-icons">add_box</span>
              </button>

            </td>
            <td class="border-cell">{ingredient.common_name}</td>
            <td class="border-cell">{ingredient.cas}</td>
            <td class="border-cell">{ingredient.volatility}</td>
            <td class="border-cell">{ingredient.descriptors}</td>
            <td class="border-cell">{ingredient.use}</td>
            <td class="border-cell">{ingredient.is_restricted}</td>
          </tr>
        {/each}
        </tbody>
      </table>
    {/if}
  </div>

</div>

<style>
  .border-header {
    @apply border-r border-slate-600;
  }

  .border-cell {
    @apply border-r border-b border-slate-600;
  }


</style>