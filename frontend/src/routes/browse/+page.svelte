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

<main>
  <h1>Browse Page</h1>
  <input type="text" bind:value={searchTerm} placeholder="Search..." />
  <button on:click={searchIngredients}>Search</button>
  <button on:click={prevPage}>Prev</button>
  <button on:click={nextPage}>Next</button>

  {#if isLoading} <!-- If isLoading is true, display a loading message -->
    <p>Loading...</p>
  {:else} <!-- Once data is fetched, render the #each block -->
  <table>
    <thead>
    <tr>
      <th>Add to collection</th>
      <th>Common Name</th>
      <th>CAS</th>
      <th>Ingredient Type</th>
      <th>Volatility</th>
      <th>Descriptors</th>
      <th>Use</th>
      <th>Is Restricted</th>
    </tr>
    </thead>
    <tbody>
    {#each data.results as ingredient (ingredient.id)}
      <tr>
        <td>
          <button on:click={() => addToCollection(ingredient.id)}>Add to collection</button>
        </td>
        <td>{ingredient.common_name}</td>
        <td>{ingredient.cas}</td>
        <td>{ingredient.ingredient_type}</td>
        <td>{ingredient.volatility}</td>
        <td>{ingredient.descriptors}</td>
        <td>{ingredient.use}</td>
        <td>{ingredient.is_restricted}</td>
      </tr>
    {/each}
    </tbody>
  </table>
    {/if}
</main>
```