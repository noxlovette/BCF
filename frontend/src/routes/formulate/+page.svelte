<script>
  import { onDestroy, onMount } from "svelte";
  import { fetchDataFromDjango } from "$lib/DjangoAPI.ts";
  import { writable } from "svelte/store";
  import Header from "$lib/components/Header.svelte";
  import { fade } from "svelte/transition";
  import {blur} from "svelte/transition";
  import Footer from "$lib/components/Footer.svelte";
  import {quintOut} from "svelte/easing";

  // main functionality
  let userId = 0,
    formulae = [],
    formulaDetail = null,
    editing = false,
    editedFormula = null;
  if (typeof window !== "undefined") {
    userId = window.sessionStorage.getItem("user_id");
  }
  let ingredientCounter = 0; // Add this line
  // dropdown functionality
  let text = "";
  let dropdownItems = writable([]);
  let activeIngredient = writable(null); // Add this line
  let cleanup = () => {};

  async function fetchFormulae() {
    console.log("Fetching formulae");
    let url = `http://localhost:8000/formulae/api/formula/${userId}/list/`;
    formulae = await fetchDataFromDjango(url);
    console.log(formulae);
  }

  async function fetchFormulaDetail(formulaId) {
    console.log("Fetching formula detail");
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
    console.log("Adding ingredient");
    // Create a new ingredient object
    let newIngredient = {
      id: `new-${ingredientCounter}`, // Use the counter to generate a unique id
      ingredient: "Something new", // Set the initial ingredient to an empty string
      volatility: "", // Set the initial volatility to an empty string
      amount: 0, // Set the initial amount to 0
      percentage: 100, // Set the initial percentage to 0
    };

    // Push the new ingredient to the editedFormula.ingredients array
    editedFormula.ingredients.push(newIngredient);

    // Reassign the array to trigger a reactive update
    editedFormula.ingredients = [...editedFormula.ingredients];

    ingredientCounter++; // Increment the counter
  }

  async function saveChanges() {
    // Save the changes to the server here...
    console.log("Saving changes");

    let updatedIngredients = editedFormula.ingredients.map((ingredient, i) => {
      console.log(ingredient);
      let updatedIngredient = {
        id: ingredient.id,
        collection_ingredient_id: ingredient.collection_ingredient_id,
        custom_collection_ingredient_id:
          ingredient.custom_collection_ingredient_id,
        amount: ingredient.amount,
        percentage: ingredient.percentage,
      };

      // If the ingredient ID starts with 'new-', set it to null
      if (
        typeof ingredient.id === "string" &&
        ingredient.id.startsWith("new-")
      ) {
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
    let data = await fetchDataFromDjango(url, "PUT", formData);
    console.log("updated formula", data);

    formulaDetail = data;

    // Then reset the editing state
    editing = false;
    editedFormula = null;
  }

  async function createFormula() {
    const formData = {
      name: "New Formula",
      description: "Write something inspiring here!",
      ingredients: [],
      user: userId,
    };

    let url = `http://localhost:8000/formulae/api/formula/${userId}/new/`;
    let data = await fetchDataFromDjango(url, "POST", formData);
    console.log(data);

    fetchFormulae()

  }

  async function populateDropdown(query) {
    console.log("Populating dropdown...");
    let url = `http://localhost:8000/collection/api/collection/${userId}/?page=1&search=${query}&page_size=5`;
    const data = await fetchDataFromDjango(url);
    dropdownItems.set(data.results);
  }

  function handleInput(event, ingredient) {
    // Add ingredient parameter
    console.log("Ingredient ID:", ingredient.id);
    text = event.target.value;
    activeIngredient.set(ingredient); // Update activeIngredient when an input field is focused
    console.log("Input:", text);
    console.log("Active ingredient:", $activeIngredient);
    console.log("Active ingredient ID:", $activeIngredient.id);
    populateDropdown(text);
  }

  async function selectItem(item) {
    text = item.common_name;
    console.log("Selected item:", text);

    // Update the activeIngredient
    if ($activeIngredient) {
      $activeIngredient.ingredient = item.common_name;
      $activeIngredient.volatility = item.volatility || null; // Set to null if volatility is not provided

      // Update the associated id based on the type of the selected item
      if (item.type === "CustomCollectionIngredient") {
        $activeIngredient.collection_ingredient_id = null;
        $activeIngredient.custom_collection_ingredient_id = item.id;
      } else {
        $activeIngredient.collection_ingredient_id = item.id || null; // Set to null if id is not provided
        $activeIngredient.custom_collection_ingredient_id = null;
      }

      $activeIngredient.use = item.use || null; // Set to null if use is not provided

      // Find the index of the activeIngredient in the editedFormula.ingredients array
      let index = editedFormula.ingredients.findIndex(
        (ingredient) => ingredient === $activeIngredient,
      );

      // Update the ingredient at the found index
      editedFormula.ingredients[index] = $activeIngredient;

      activeIngredient.set(null); // Reset the activeIngredient

      // Reassign the array to trigger a reactive update
      editedFormula.ingredients = [...editedFormula.ingredients];
    }
  }

  async function deleteFormula(formulaId) {
    console.log("Deleting formula");
    let url = `http://localhost:8000/formulae/api/formula/${userId}/${formulaId}/delete/`;
    let response = await fetchDataFromDjango(url, "DELETE");
    console.log(response);
    // Remove the deleted formula from the formulae array
    formulae = formulae.filter((formula) => formula.id !== formulaId);
  }

  async function deleteIngredient(ingredientId) {
    console.log("Deleting ingredient");
    let url = `http://localhost:8000/formulae/api/ingredient/${userId}/${ingredientId}/delete/`;
    let response = await fetchDataFromDjango(url, "DELETE");
    console.log(response);
    // Remove the deleted ingredient from the ingredients array
    editedFormula.ingredients = editedFormula.ingredients.filter(
      (ingredient) => ingredient.id !== ingredientId,
    );
  }

  async function addAsCustom(formula) {
    console.log("Adding as custom");
    const data = {
      user: userId,
      common_name: formula.name,
      use: formula.description,
      formula: formula.id,
      cas: 'BASE',
      volatility: 'base',
      amount: 0,
      unit: 'g',
      ideas: '',
      impression: '',
      associations: '',
      colour: '',
    };
    let url = `http://localhost:8000/formulae/api/formula/${userId}/${formula.id}/add_as_custom/`;

    let response = await fetchDataFromDjango(url, "POST", data);
    if (response) {
      console.log(response);
      notification.set("Formula added as custom ingredient");
    }
  }

  async function addTag(formulaId) {
    console.log("Adding tag");
    let tag = prompt("Enter a tag for this formula:");
    if (tag) {
      const data = {
        user: userId,
        tag: tag,
      };
      let url = `http://localhost:8000/formulae/api/formula/${userId}/${formulaId}/add_tag/`;

      let response = await fetchDataFromDjango(url, "POST", data);
      if (response) {
        console.log(response);
        notification.set("Tag added to formula");
      }
    }
  }

  let notification = writable("");

  let solventValue = 0;
  $: if (formulaDetail) {
    let totalAmount = formulaDetail.ingredients.reduce((acc, ingredient) => acc + ingredient.amount, 0);
    solventValue = 1000 - totalAmount; // Calculates the difference from 1000
  }

  let isLoading = true;

  onMount(async () => {
    // redirect the user the hell out of here if they are not authenticated. TODO add to all pages
    let is_authenticated = sessionStorage.getItem("is_authenticated");
  if (is_authenticated === "false" || is_authenticated === null) {
    window.location.href = "/auth/login";
  }
  cleanup = () => {};
  populateDropdown("");
  fetchFormulae();
  setTimeout(() => {
        isLoading = false;
    }, 1000);
  });

  onDestroy(() => {
    cleanup();
  });
</script>


<div class="flex flex-col min-h-screen" style="background: url('/assets/bg/bbblurry-formulate.svg') no-repeat center center fixed; background-size: cover;">
  <Header currentPage="formulate" notification = {notification}/>
  <div class="mb-auto flex justify-center items-center">
    {#if isLoading}
<div id="spinner" class="flex size-16 border-4 m-10 border-lime-400 border-dotted rounded-full animate-spin" />
{:else}
  <div id="app" class="flex flex-row rounded-lg shadow items-stretch size-3/4 m-2 mt-0 p-4 lowercase font-light text-amber-950/90 dark:text-amber-200/80 bg-amber-50/60"
  transition:fade={{duration: 500}}
  >

    
  <div id="sidebar" class="flex flex-col w-1/4 mr-auto bg-lime-800/70 text-amber-100/90 rounded-lg drop-shadow p-4"
  transition:fade={{delay:250, duration: 500}}
  >
    <h2 id="formula-header" class= "text-4xl mb-4 border-b-2 border-amber-100/20">my formulae</h2>
    <ul id="formulate-list" class= "tracking-tight overflow-y-hidden divide-y-2 divide-amber-100/20">
      {#each formulae as formula}
        <li id="formula-item" class="flex flex-col  hover:bg-amber-100/80 hover:text-amber-800/60 hover:rounded-lg hover:shadow p-2 transition-all duration-300" on:dblclick={() => viewFormula(formula.id)} title={formula.description}>
          <p id="formula-name" class="font-regular text-lg">{formula.name}</p>
          <p id="formula-edit-time" class="font-thin">{formula.updated}</p>
        </li>
      {/each}
      <li id="formula-item" class="flex flex-col hover:bg-amber-600/30 hover:rounded-lg hover:shadow p-2 transition-all duration-300" on:dblclick={createFormula}>create new formula</li>
    </ul>
  </div>
  <div id="main-content" class="flex flex-row items-start flex-1 bg-amber-50/80 rounded-lg shadow ml-4">
    {#if formulaDetail}
      {#if formulaDetail.id == 0}
        <button
          class="m-2 p-2 bg-lime-600/50 hover:text-lime-900/25 rounded-lg shadow"
          id="create-formula"
          on:click={createFormula}>create formula</button
        >
      {/if}
      {#if editing}
        <!-- Editing mode -->
        <div id="description-etc" class="flex flex-col mr-auto w-1/4 p-4 h-full divide-y-4 divide-amber-800/60 space-y-4 bg-amber-100/80 rounded-lg shadow">
          <div>
            <h3 class="font-bold">description: </h3>
            <input class="flex w-full bg-amber-50/20 dark:bg-amber-950/20  focus:ring-amber-700/70 focus:ring-2 rounded-lg border-slate-400" bind:value={editedFormula.description} />
          </div>  
            <div class="font-bold">
              <h3 >notes: </h3>
              <textarea class="flex w-full bg-amber-50/20 dark:bg-amber-950/20  focus:ring-amber-700/70 focus:ring-2 rounded-lg border-slate-400" bind:value={editedFormula.notes} />
            </div>
            
          <div id="controls" class="pt-4">
            <button class=" hover:text-lime-800/70 dark:hover:text-lime-300/60 transition-all hover:scale-110" on:click={saveChanges}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-amber-950/60 dark:hover:text-amber-400/60">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </button>
            <button class=" hover:text-lime-800/70 dark:hover:text-lime-300/60 transition-all hover:scale-110"
              on:click={() => {
                editing = false;
                editedFormula = null;
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-amber-950/60 dark:hover:text-amber-400/60">
                <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              
              </button
            >
            
            <button class=" hover:text-lime-800/70 dark:hover:text-lime-300/60 transition-all hover:scale-110" on:click={() => deleteFormula(editedFormula.id)}
              >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-amber-950/60 dark:hover:text-amber-400/60">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              
              </button
            >
          </div>
        </div>
        <div id="table-wrapper" class="flex flex-col items-start m-2 pl-2 w-full">
        <input class="flex w-full text-6xl tracking-widest bg-amber-50/20 dark:bg-amber-950/20  focus:ring-amber-700/70 focus:ring-2 rounded-lg border-slate-400" bind:value={editedFormula.name} />
        <table id="formula-ingredient-table" class="table-fixed text-left w-full m-2 pl-2">
          <thead>
            <tr class="*:p-2">
              <th class="w-min">#</th>
              <th class="w-1/2"> Ingredient </th>
              <th class="w-1/6"> Volatility </th>
              <th class="w-1/6"> Amount </th>
              <th class="w-1/12"> % </th>
            </tr>
          </thead>
          <tbody>
            {#if Array.isArray(editedFormula.ingredients)}
              {#each editedFormula.ingredients as ingredient, i (ingredient.id)}
              <tr>
                <td class="align-middle">
                  <button class=" hover:text-lime-800/70 dark:hover:text-lime-300/60 transition-all hover:scale-110" on:click={() => deleteIngredient(ingredient.id)}
                    ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-amber-300/60">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                    </button
                  >
                </td> 
                <td>
                  <input
                    type="text"
                    class="flex w-full bg-amber-50/20 dark:bg-amber-950/20  focus:ring-amber-700/70 focus:ring-2 rounded-lg border-slate-400"
                    bind:value={ingredient.ingredient}
                    on:input={(event) => handleInput(event, ingredient)}
                  />
                  <ul
                    id="ingredient-dropdown"
                    class="dropdown-menu *:p-1 bg-lime-800/20 rounded-lg shadow-lg items-center flex transition-all duration-300"
                    class:active={$activeIngredient &&
                      $activeIngredient.id === ingredient.id}
                  >
                    {#if $dropdownItems.length === 0}
                      <button class="dropdown-item rounded-lg hover:text-amber-100/90 dark:hover:text-lime-300/60 w-full font-light"
                        >No matching ingredients found</button
                      >
                    {:else if Array.isArray($dropdownItems)}
                      {#each $dropdownItems as item (item.common_name)}
                        {#if $dropdownItems.length < 6}
                          <button
                            class="dropdown-item hover:bg-lime-800/60 rounded-lg hover:text-amber-100/90 dark:hover:text-lime-300/60 w-full font-light text-sm transition-all duration-300"
                            on:click={() => selectItem(item)}
                            >{item.common_name}</button
                          >
                        {/if}
                      {/each}
                    {:else}
                      <button class="dropdown-item rounded-lg hover:text-amber-100/90 dark:hover:text-lime-300/60 w-full font-light"
                        >No matching ingredients found</button
                      >
                    {/if}
                  </ul>
                </td>

                  <td>{ingredient.volatility}</td> <!-- unchangeable -->

                  <td>
                    <input type="number" bind:value={ingredient.amount} class="flex w-full bg-amber-50/20 dark:bg-amber-950/20  focus:ring-amber-700/70 focus:ring-2 rounded-lg border-slate-400"/>
                  </td>
                  <td>
                    <input type="number" bind:value={ingredient.percentage} class="flex w-full bg-amber-50/20 dark:bg-amber-950/20  focus:ring-amber-700/70 focus:ring-2 rounded-lg border-slate-400"/>
                  </td>

                
              </tr>
              {/each}
              
            {/if}
            <td>
              <button on:click={addIngredient}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                
              </button>
              </td>
              <tr id="functional">
                <td class="pl-2">x</td>
                <td class="pl-2">alcohol</td>
                <td class="pl-2">solvent</td>
                <td class="pl-2 {solventValue < 0 ? 'text-red-700/80' : ''}">{solventValue}</td>
                <td class="pl-2">100</td>
              </tr>
          </tbody>


        </table>
      </div>

      {:else}
          <div id="description-etc" class="flex flex-col mr-auto w-1/4 p-4 h-full divide-y-4 divide-amber-800/60 space-y-4 bg-amber-100/80 rounded-lg shadow">
            <div>
              <h3 class="font-bold">description: </h3>
              <p class="">{formulaDetail.description}</p>
            </div>
              <div class="pt-4">
                <h3 class="font-bold">notes: </h3>
              <p class="">{formulaDetail.notes}</p>
            </div>
              <div id = "controls" class="pt-4">
                <button class=" hover:text-lime-800/70 dark:hover:text-lime-300/60 transition-all hover:scale-110" on:click={() => editFormula(formulaDetail)} title="edit the formula">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                  </svg>
                  </button>
                  <button class=" hover:text-lime-800/70 dark:hover:text-lime-300/60 transition-all hover:scale-110" on:click={() => deleteFormula(formulaDetail.id)} title="delete the formula">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                  <button class=" hover:text-lime-700/80 dark:hover:text-lime-300/60 transition-all hover:scale-110" on:click={() => addAsCustom(formulaDetail)} title="add the formula to collection as ingredient">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" />
                    </svg>
                  </button>
                  <button class=" hover:text-lime-700/80 dark:hover:text-lime-300/60 transition-all hover:scale-110" on:click={() => addTag(formulaDetail.id)} title='add tags to your formula'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
                    </svg>
                  </button>
            </div>
          </div>
          <div id="table-wrapper" class="flex flex-col items-start m-2 pl-2 w-full">
          <h2 class="text-6xl tracking-widest mb-4">{formulaDetail.name}</h2>
          <table id="formula-ingredient-table" class="table-fixed text-left w-full">
            <thead>
              <tr class="*:p-2">
                <th class="w-min">#</th>
                <th class="w-1/2"> Ingredient </th>
                <th class="w-1/6"> Volatility </th>
                <th class="w-1/6"> Amount </th>
                <th class="w-1/12"> % </th>
              </tr>
            </thead>
            <tbody>
              {#each formulaDetail.ingredients as ingredient, i (ingredient.id)}
                <tr>
                  <td class="pl-2">{i + 1}</td>
                  <td class="pl-2">{ingredient.ingredient}</td>
                  <td class="pl-2">{ingredient.volatility}</td>
                  <td class="pl-2">{ingredient.amount}</td>
                  <td class="pl-2">{ingredient.percentage}</td>
                </tr>
              {/each}
              <tr id="functional">
                <td class="pl-2">x</td>
                <td class="pl-2">alcohol</td>
                <td class="pl-2">solvent</td>
                <td class="pl-2 {solventValue < 0 ? 'text-red-700/80' : ''}">{solventValue}</td>
                <td class="pl-2">100</td>
              </tr>
            </tbody>
          </table>
        </div>
          
          

      {/if}

    {/if}
  </div>
  </div>
{/if}  
</div>
  <Footer />
</div>

<style>
  .dropdown-menu {
    display: none;
  }
  .dropdown-menu.active {
    display: block;
  }
</style>
