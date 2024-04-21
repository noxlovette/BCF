<script>
  import { onMount } from 'svelte';
  import { fetchDataFromDjango } from '$lib/DjangoAPI.js';
  import Button from '$lib/components/Button.svelte';

  let userId = 0;
  let ingredients = [];
  if (typeof window !== 'undefined') {
    userId = window.sessionStorage.getItem('user_id');
  }
  let common_name;
  let cas;
  let volatility;
  let use;
  let colour;
  let impression;
  let date_added;
  let is_collection;
  let amount;

  onMount(fetchIngredients);

  function isEditableField(ingredientType, fieldName) {
    // Define which fields are editable for each type of ingredient
    const editableFields = {
      'CollectionIngredient': ['colour', 'impression', 'is_collection', 'amount'],
      'CustomCollectionIngredient': ['common_name', 'cas', 'volatility', 'use', 'colour', 'impression', 'is_collection', 'amount']
    };

    // Check if the field is editable for the given ingredient type
    return editableFields[ingredientType].includes(fieldName);
  }

  async function fetchIngredients() {
    console.log('Fetching ingredients...');
    let url = `http://localhost:8000/collection/api/collection/${userId}/`;
    const data = await fetchDataFromDjango(url);

    ingredients = Array.isArray(data) ? data : [data];
    ingredients = ingredients.map(ingredient => ({ ...ingredient, isEditing: false }));
  }

  // delete ingredient, custom or otherwise
  async function handleDeleteClick (event) {
    const id = event.target.dataset.id;
    const type = event.target.dataset.type;
    console.log('id inside handle delete:', id, 'type inside handle delete:', type)
    let url
    if (type === 'CollectionIngredient') {
      url = `http://localhost:8000/collection/api/ingredient/${userId}/${id}/delete/`;
    } else if (type === 'CustomCollectionIngredient') {
      url = `http://localhost:8000/collection/api/ingredient/${userId}/custom/${id}/delete/`;
    }
    try {
      const response = await fetchDataFromDjango(url, 'DELETE');
      console.log('Response:', response)
      fetchIngredients();
    } catch (error) {
      console.error('Error deleting ingredient:', error);
    }
  }

  async function saveEdit(ingredientToSave) {
    // Collect the data from the input fields
    const data = {
      common_name: ingredientToSave.common_name,
      cas: ingredientToSave.cas,
      volatility: ingredientToSave.volatility,
      use: ingredientToSave.use,
      colour: ingredientToSave.colour,
      impression: ingredientToSave.impression,
      is_collection: ingredientToSave.is_collection,
      amount: ingredientToSave.amount,
      unit: ingredientToSave.unit
    };

    // Define the URL for the PUT request
    let url;
    if (ingredientToSave.type === 'CollectionIngredient') {
      url = `http://localhost:8000/collection/api/ingredient/${userId}/${ingredientToSave.id}/update/`;
    } else if (ingredientToSave.type === 'CustomCollectionIngredient') {
      url = `http://localhost:8000/collection/api/ingredient/${userId}/custom/${ingredientToSave.id}/update/`;
    }

    // Send the PUT request to the server
    try {
      const response = await fetchDataFromDjango(url, 'PUT', data);
      console.log('Response:', response);
      // Fetch the updated ingredients
      fetchIngredients();
    } catch (error) {
      console.error('Error saving edited ingredient:', error);
    }
  }

  function toggleEdit(ingredientToEdit) {
    // Find the index of the ingredient in the ingredients array
    const index = ingredients.findIndex(ingredient => ingredient.id === ingredientToEdit.id);

    // Toggle the isEditing property of the ingredient
    if (index !== -1) {
      ingredients[index] = { ...ingredients[index], isEditing: !ingredients[index].isEditing };

      // Assign a new array to ingredients to trigger a re-render
      ingredients = [...ingredients];
    }
  }

  let isModalVisible = false;

  function showModal() {
    isModalVisible = true;
  }

  function hideModal() {
    isModalVisible = false;
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
      date_added,
      is_collection,
      amount,
      unit: 'g'
    };

    // Define the URL for the POST request
    const url = `http://localhost:8000/collection/api/ingredient/${userId}/new/`;

    // Send the POST request to the server
    try {
      const response = await fetchDataFromDjango(url, 'POST', data);
      console.log('Response:', response);
      // Fetch the updated ingredients
      fetchIngredients();
      hideModal();
    } catch (error) {
      console.error('Error creating custom ingredient:', error);
    }
  }

  function cancelCreate() {
    isModalVisible = false;
    fetchIngredients();
  }
</script>

<div class="table-wrapper">
  <table>
    {#each ingredients as ingredient (ingredient.id)}
      <tr>
        {#if ingredient.isEditing}
          {#if isEditableField(ingredient.type, 'common_name')}
            <td><input bind:value={ingredient.common_name} /></td>
          {:else}
            <td>{ingredient.common_name || 'name unknown'}</td>
          {/if}
          {#if isEditableField(ingredient.type, 'cas')}
            <td><input bind:value={ingredient.cas} /></td>
          {:else}
            <td>{ingredient.cas || 'cas unknown'}</td>
          {/if}
          {#if isEditableField(ingredient.type, 'volatility')}
            <td><input bind:value={ingredient.volatility} /></td>
          {:else}
            <td>{ingredient.volatility || 'no volatility specified'}</td>
          {/if}
          {#if isEditableField(ingredient.type, 'use')}
            <td><input bind:value={ingredient.use} /></td>
          {:else}
            <td>{ingredient.use || 'use not specified'}</td>
          {/if}
          {#if isEditableField(ingredient.type, 'colour')}
            <td><input bind:value={ingredient.colour} /></td>
          {:else}
            <td>{ingredient.colour || 'no colour specified'}</td>
          {/if}
          {#if isEditableField(ingredient.type, 'impression')}
            <td><input bind:value={ingredient.impression} /></td>
          {:else}
            <td>{ingredient.impression || 'no impression specified yet'}</td>
          {/if}
          <td>{ingredient.date_added || 'date unknown'}</td>
          {#if isEditableField(ingredient.type, 'is_collection')}
            <td><input type="checkbox" bind:value={ingredient.is_collection} /></td>
          {:else}
            <td>{ingredient.is_collection || ''}</td>
          {/if}
          {#if isEditableField(ingredient.type, 'amount')}
            <td><input type="number" bind:value={ingredient.amount} /></td>
          {:else}
            <td>{ingredient.amount || '0'} {ingredient.unit}</td>
          {/if}
          <td>
            <button on:click={() => { saveEdit(ingredient); toggleEdit(ingredient); }}>Save</button>
          </td>
        {:else}
          <td>{ingredient.common_name || 'name unknown'}</td>
          <td>{ingredient.cas || 'cas unknown'}</td>
          <td>{ingredient.volatility || 'no volatility specified'}</td>
          <td>{ingredient.use || 'use not specified'}</td>
          <td>{ingredient.colour || 'no colour specified'}</td>
          <td>{ingredient.impression || 'no impression specified yet'}</td>
          <td>{ingredient.date_added || 'date unknown'}</td>
          <td>{ingredient.is_collection || ''}</td>
          <td>{ingredient.amount || '0'} {ingredient.unit}</td>
          <td>
            <button class="delete" on:click={event => handleDeleteClick(event)}
                    data-id={ingredient.id} data-type={ingredient.type}>Delete</button>
            <button on:click={() => toggleEdit(ingredient)}>Edit</button>
          </td>
        {/if}
      </tr>
    {/each}
  </table>
  {#if isModalVisible}
    <div id="modal">
      <table>
        <tr>
          <td><input bind:value={common_name} placeholder="Name"></td>
          <td><input bind:value={cas} placeholder="CAS"></td>
          <td><input bind:value={volatility} placeholder="Volatility"></td>
          <td><input bind:value={use} placeholder="Use"></td>
          <td><input bind:value={colour} placeholder="Colour"></td>
          <td><textarea bind:value={impression} placeholder="Impression"></textarea></td>
          <td><input type="date" bind:value={date_added} placeholder="Leave to save now"></td>
          <td><input type="checkbox" bind:checked={is_collection}></td>
          <td><input type="number" bind:value={amount} placeholder="Amount"></td>
          <td>
            <button on:click={createCustomIngredient}>Done</button>
            <button on:click={cancelCreate}>Cancel</button>
          </td>
      </table>
      <button on:click={hideModal}>Close</button>
    </div>
  {/if}

  <button on:click={fetchIngredients}>Refresh</button>
  <button on:click={showModal}>Create Ingredient</button>
  <button on:click={() => window.location.href = '/browse'}>Find more ingredients</button>
</div>


<style>
  #modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    max-width: 100%; /* Limit the width of the modal to the width of the page */
    overflow-x: auto; /* Add a scrollbar if the content is wider than the modal */
  }
</style>