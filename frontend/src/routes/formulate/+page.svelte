<script>
  import { onDestroy, onMount } from 'svelte';
  import { fetchDataFromDjango } from "$lib/DjangoAPI.js";
  import { writable } from "svelte/store";
  // main functionality
  let userId = 0, formulae = [], formulaDetail = null, editing = false, editedFormula = null;
  if (typeof window !== 'undefined') {
    userId = window.sessionStorage.getItem('user_id');
  }
  let ingredientCounter = 0; // Add this line
  // dropdown functionality
  let text = '';
  let dropdownItems = writable([]);
  let activeIngredient = writable(null); // Add this line
  let cleanup = () => {};


  async function fetchFormulae() {
    console.log('Fetching formulae');
    let url = `http://localhost:8000/formulae/api/formula/${userId}/list/`;
    formulae = await fetchDataFromDjango(url);
    console.log(formulae);
  }

  async function fetchFormulaDetail(formulaId) {
    console.log('Fetching formula detail');
    let url = `http://localhost:8000/formulae/api/formula/${userId}/${formulaId}/`;
    formulaDetail = await fetchDataFromDjango(url);
    console.log(formulaDetail);
  }

  function viewFormula(formulaId) {
    fetchFormulaDetail(formulaId);
  }

  function editFormula(formula) {
    editing = true;
    editedFormula = { ...formula }; // Create a copy of the formula to edit
  }

  function addIngredient() {
    console.log('Adding ingredient');
    // Create a new ingredient object
    let newIngredient = {
      id: `new-${ingredientCounter}`, // Use the counter to generate a unique id
      ingredient: 'Something new', // Set the initial ingredient to an empty string
      volatility: '', // Set the initial volatility to an empty string
      amount: 0, // Set the initial amount to 0
    };

    // Push the new ingredient to the editedFormula.ingredients array
    editedFormula.ingredients.push(newIngredient);

    // Reassign the array to trigger a reactive update
    editedFormula.ingredients = [...editedFormula.ingredients];

    ingredientCounter++; // Increment the counter
  }

  async function saveChanges() {
    // Save the changes to the server here...
    console.log('Saving changes');

    let updatedIngredients = editedFormula.ingredients.map((ingredient, i) => {
      console.log(ingredient);
      let updatedIngredient = {
        id: ingredient.id,
        collection_ingredient_id: ingredient.collection_ingredient_id,
        custom_collection_ingredient_id: ingredient.custom_collection_ingredient_id,
        amount: ingredient.amount,
      };

      // If the ingredient ID starts with 'new-', set it to null
      if (typeof ingredient.id === 'string' && ingredient.id.startsWith('new-')) {
        updatedIngredient.id = null;
      }

      return updatedIngredient;
    });

    const formData = {
      user: userId,
      name: editedFormula.name,
      description: editedFormula.description,
      ingredients: updatedIngredients,
    };

    let url = `http://localhost:8000/formulae/api/formula/${userId}/${editedFormula.id}/`;
    let data = await fetchDataFromDjango(url, 'PUT', formData);
    console.log('updated formula', data);

    formulaDetail = data;

    // Then reset the editing state
    editing = false;
    editedFormula = null;
  }


  async function createFormula() {
    const formData = {
      name: 'New Formula',
      description: 'Write something inspiring here!',
      ingredients: [],
      user: userId,
    };

    let url = `http://localhost:8000/formulae/api/formula/${userId}/new/`;
    let data = fetchDataFromDjango(url, 'POST', formData)
    console.log(data);
  }

  async function populateDropdown(query) {
    console.log('Populating dropdown...');
    let url = `http://localhost:8000/collection/api/collection/${userId}/?search=${query}`;
    const data = await fetchDataFromDjango(url);
    dropdownItems.set(data);
  }

  function handleInput(event, ingredient) { // Add ingredient parameter
    console.log('Ingredient ID:', ingredient.id);
    text = event.target.value;
    activeIngredient.set(ingredient); // Update activeIngredient when an input field is focused
    console.log('Input:', text);
    console.log('Active ingredient:', $activeIngredient);
    console.log('Active ingredient ID:', $activeIngredient.id);
    populateDropdown(text);
  }

  async function selectItem(item) {
    text = item.common_name;
    console.log('Selected item:', text);

    // Update the activeIngredient
    if ($activeIngredient) {
      $activeIngredient.ingredient = item.common_name;
      $activeIngredient.volatility = item.volatility || null; // Set to null if volatility is not provided

      // Update the associated id based on the type of the selected item
      if (item.type === 'CustomCollectionIngredient') {
        $activeIngredient.collection_ingredient_id = null;
        $activeIngredient.custom_collection_ingredient_id = item.id;
      } else {
        $activeIngredient.collection_ingredient_id = item.id || null; // Set to null if id is not provided
        $activeIngredient.custom_collection_ingredient_id = null;
      }

      $activeIngredient.use = item.use || null; // Set to null if use is not provided

      // Find the index of the activeIngredient in the editedFormula.ingredients array
      let index = editedFormula.ingredients.findIndex(ingredient => ingredient === $activeIngredient);

      // Update the ingredient at the found index
      editedFormula.ingredients[index] = $activeIngredient;

      // Reassign the array to trigger a reactive update
      editedFormula.ingredients = [...editedFormula.ingredients];
    }
  }

  async function deleteFormula(formulaId) {
    console.log('Deleting formula');
    let url = `http://localhost:8000/formulae/api/formula/${userId}/${formulaId}/delete/`;
    let response = await fetchDataFromDjango(url, 'DELETE');
    console.log(response);
    // Remove the deleted formula from the formulae array
    formulae = formulae.filter(formula => formula.id !== formulaId);
  }

  async function deleteIngredient(ingredientId) {
    console.log('Deleting ingredient');
    let url = `http://localhost:8000/formulae/api/ingredient/${userId}/${ingredientId}/delete/`;
    let response = await fetchDataFromDjango(url, 'DELETE');
    console.log(response);
    // Remove the deleted ingredient from the ingredients array
    editedFormula.ingredients = editedFormula.ingredients.filter(ingredient => ingredient.id !== ingredientId);
  }


  onMount(fetchFormulae);
  onMount(async () => {
    cleanup = () => {};
    populateDropdown('');
  });

  onDestroy(() => {
    cleanup();
  });

</script>

<div id="app">
  <div id="sidebar">
    <h2 id="formula-header">My Formulae</h2>
    <ul id="formulate-list">
      {#each formulae as formula (formula.id)}
        <li class="formula-item">
          <p id="formula-name">Name: {formula.name}</p>
          <p id="formula-edit-time">Edited: {formula.updated}</p>
          <button class="btn btn-primary btn-formula" id="view-formula" on:click={() => viewFormula(formula.id)}>View Formula</button>
          <button on:click={() => deleteFormula(formula.id)}>Delete</button>
        </li>
      {/each}
    </ul>
  </div>

  <div id="main-content">
    {#if formulaDetail}
      {#if formulaDetail.id == 0}
        <button class="btn btn-primary" id="create-formula" on:click={createFormula}>Create Formula</button>
      {/if}
      {#if editing}
        <!-- Editing mode -->
        <div>
          <label>
            Name:
            <input bind:value={editedFormula.name} />
          </label>
          <label>
            Description:
            <input bind:value={editedFormula.description} />
          </label>
          <!-- Add more fields as needed... -->
          <button on:click={saveChanges}>Save</button>
          <button on:click={() => { editing = false; editedFormula = null; }}>Cancel</button>
          <button on:click={addIngredient}>Add Ingredient</button>
          <button on:click={() => deleteFormula(formula.id)}>Delete Formula</button>

          <div>
            {#if Array.isArray(editedFormula.ingredients)}
              {#each editedFormula.ingredients as ingredient, i (ingredient.id)}
                <div>
                  <input type="text" bind:value={ingredient.ingredient}
                         on:input={(event) => handleInput(event, ingredient)} />
                  <ul id="ingredient-dropdown" class="dropdown-menu" class:active={$activeIngredient && $activeIngredient.id === ingredient.id}>
                    {#if $dropdownItems.length === 0}
                      <button class="dropdown-item">No matching ingredients found</button>
                    {:else}
                      {#if Array.isArray($dropdownItems)}
                        {#each $dropdownItems as item (item.common_name)}
                          {#if $dropdownItems.length < 6}
                            <button class="dropdown-item" on:click={() => selectItem(item)}>{item.common_name}</button>
                          {/if}
                        {/each}
                      {:else}
                        <button class="dropdown-item">No matching ingredients found</button>
                      {/if}
                    {/if}
                  </ul>
                  <td>{ingredient.volatility}</td>
                  <input type="number" bind:value={ingredient.amount} />
                </div>
                {#if i < editedFormula.ingredients.length - 1}
                  <hr/>
                {/if}
                <button on:click={() => deleteIngredient(ingredient.id)}>Remove Ingredient</button>
              {/each}
            {/if}
          </div>



        </div>

      {:else}
      <div class="formula-detail">
        <table class="formula-detail-table">
          <tr>
            <td>Name:</td>
            <td class="editable-detail-table" id="formula-name">{formulaDetail.name}</td>
          </tr>
          <tr>
            <td>Description:</td>
            <td class="editable-detail-table" id="formula-description">{formulaDetail.description}</td>
          </tr>
          <tr>
            <td>Time Edited:</td>
            <td>{formulaDetail.updated_at}</td>
          </tr>
          <button on:click={() => editFormula(formulaDetail)}>Edit</button>
        </table>
        <table class="formula-ingredient-table">
          <tr>
            <th>#</th>
            <th>Ingredient</th>
            <th>Volatility</th>
            <th>Amount</th>
          </tr>
          {#each formulaDetail.ingredients as ingredient, i (ingredient.id)}
            <tr>
              <td>{i + 1}</td>
              <td>{ingredient.ingredient}</td>
              <td>{ingredient.volatility}</td>
              <td>{ingredient.amount}</td>
            </tr>
          {/each}
        </table>
      </div>
    {/if}
    {/if}
    </div>
    </div>

<style>
  .dropdown-menu {
    display: none;
  }
  .dropdown-menu.active {
    display: block;
  }
</style>
