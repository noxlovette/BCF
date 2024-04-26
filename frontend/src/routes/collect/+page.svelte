<script>
  import { onMount } from "svelte";
  import { fetchDataFromDjango } from "$lib/DjangoAPI.ts";
    import Header from "$lib/components/Header.svelte";
    import { fade } from "svelte/transition";
    import { writable } from "svelte/store";
    import { crossfade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';




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
    window.location.href = "/login";
  }
    fetchIngredients();
  });



  async function fetchIngredients() {
    console.log("Fetching ingredients...");
    let url = `http://localhost:8000/collection/api/collection/${userId}/`;
    let data = await fetchDataFromDjango(url);

    ingredients = Array.isArray(data) ? data : [data];
    ingredients = ingredients.map((ingredient) => ({
      ...ingredient,
      isEditing: false,
    }));
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
  }

  let initialVisibleFields = [
  { name: "common_name", visible: true },
  { name: "cas", visible: true },
  { name: "volatility", visible: true },
  { name: "use", visible: true },
  { name: "colour", visible: true },
  { name: "ideas", visible: false },
  { name: "impression", visible: true },
  { name: 'associations', visible: false },
  { name: "amount", visible: true },
  { name: 'date_added', visible: false }
];
export let visibleFields = writable(initialVisibleFields);


    const editableFields = {
  CollectionIngredient: ["colour", "impression", "amount"],
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


  let editingRowId = 0;
     /**
     * @param {{object: any;}} ingredient
     */
     function toggleEdit(ingredient) {
      console.log("Toggling edit for ingredient:", ingredient);
    editingRowId = editingRowId === ingredient ? null : ingredient;
  }

  let isModalVisible = false;

  function showModal() {
    isModalVisible = true;
  }

  function hideModal() {
    isModalVisible = false;
  }


  // logic for creating a custom ingredient

  let common_name = '';
  let cas = '';
  let volatility = '';
  let use ='';
  let colour ='';
  let impression ='';
  let amount = 0;


  async function createCustomIngredient() {
    // Collect the data from the input fields
    const data = {
      common_name,
      cas,
      volatility,
      use,
      colour,
      impression,
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
    isModalVisible = false;
    fetchIngredients();
  }

// logic for searching ingredients and tools functionality

  let searchTerm = "";

    function prevPage() {
        throw new Error("Function not implemented.");
    }


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

    function handleSearch() {
        throw new Error("Function not implemented.");
    }

    function searchIngredients() {
        throw new Error("Function not implemented.");
    }

    function reset() {
        throw new Error("Function not implemented.");
    }

    function nextPage() {
        throw new Error("Function not implemented.");
    }

    let notification = writable("");


    
    
    

</script>

<Header currentPage="collect" notification={notification} />

<main>
<div id = "app" class="flex flex-col content-center lowercase">

  <div id="tools" class="flex flex-row w-full justify-between space-x-2">
    <button class="pl-2"on:click={prevPage}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
      </svg>
      
    </button>
    <div id="search-bar" class="flex flex-row w-1/2 justify-between space-x-2">
      
      <button on:click={toggleTuneMenu}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>

        
      </button>
      {#if tuneMenuVisible}
          <div id="tune-menu" class="flex w-full p-2 bg-white space-y-2 top-10">
            <div id="visibility" class="grid grid-cols-3 text-xs">
              {#each $visibleFields as field}
              <div class="flex flex-row space-x-2">
                <input class= "ml-2" type="checkbox" id={field.name} bind:checked={field.visible} on:click={() => toggleFieldVisibility(field) && console.log("clicked")} />
                <label for={field.name}>{field.name}</label>
                </div>
              {/each}
            </div>
          </div>
        {:else if tuneMenuVisible === false}
          <input
        type="text"
        class = "flex w-full p-2"
        bind:value={searchTerm}
        on:keydown={handleSearch}
        placeholder="search..."
        title="Find an ingredient by CAS or the multiple names that it might have"
      />
        {/if}
      
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
    <button on:click={showModal} title="add a new ingredient. nobody but you will see it">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      
      </button>
    <button class="pr-2" on:click={nextPage}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
      </svg>
      
    </button>
   
  </div>
  


<div class="table-wrapper" transition:fade={{duration: 500}}>
  <table class="bg-blend-screen size-full table-fixed text-sm">
  <thead class="bg-amber-100 space-x-2">
  <tr>
    {#each $visibleFields as header}
      {#if header.visible}
        <th>{header.name}</th>
      {/if}
    {/each}
  </thead>
  <tbody class="text-center divide-y divide-dashed divide-amber-300">
  {#each ingredients as ingredient}
    <tr on:dblclick={() => toggleEdit(ingredient.id)}>

      {#each $visibleFields as field}
        {#if field.visible}
          <td>
            {#if isEditableField(ingredient.type, field.name) && editingRowId === ingredient.id}
                
                <input
                  type="text"
                  bind:value={ingredient[field.name]}
                  placeholder="{field.name}"
                  on:keydown={(event) => {
                    if (event.key === "Enter") {
                      saveEdit(ingredient);
                    }
                  }}
                />
            {:else}
            {@html ingredient[field.name] || `
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>`
            }
            {/if}
          </td>

        {/if}
      {/each}
    </tr>
  {/each}
  </tbody>

  </table>

    {#if isModalVisible}
      <div id="modal" class="flex w-full">
        <div class="flex text-sm grid-cols-3">
          <input bind:value={common_name} placeholder="name" />
          <input bind:value={cas} placeholder="CAS" />
          <input bind:value={volatility} placeholder="volatility" />
          <input bind:value={use} placeholder="use" />
          <input bind:value={colour} placeholder="colour" />
          <textarea bind:value={impression} placeholder="impression"
            ></textarea>
          <input
              type="number"
              bind:value={amount}
              placeholder="amount"
            />  
        </div>
        <div class="flex flex-row space-x-2">
          <button on:click={createCustomIngredient}>Done</button>
          <button on:click={cancelCreate}>Cancel</button>
          <button on:click={hideModal}>Close</button>
      </div>
      </div>
    {/if}
  
  </div>
</div>


</main>



<style>
  
</style>
