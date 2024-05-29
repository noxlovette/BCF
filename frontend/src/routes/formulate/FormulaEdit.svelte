<script lang="ts">

    import {saveChangesFormula, deleteIngredientFormulate } from "$lib/DjangoAPI";
    import AddCrossIcon from "$lib/icons/AddCrossIcon.svelte";
    import CancelButton from "$lib/icons/CancelButton.svelte";
    import CrossIcon from "$lib/icons/CrossIcon.svelte";
    import DeleteIcon from "$lib/icons/DeleteIcon.svelte";
    import OkIcon from "$lib/icons/OkIcon.svelte";
    import SaveButton from "$lib/icons/SaveButton.svelte";
    import Dropdown from "./Dropdown.svelte";
    export let editedFormula = null;
    export let formulaDetail = null;
    export let editing = true;
    export let solventValue = 0;
    let activeEditId = null;
    let ingredientCounter = 0;

    $: if (editedFormula&& editedFormula.ingredients) {
        let totalAmount = editedFormula.ingredients.reduce((acc, ingredient) => acc + ingredient.amount, 0);
        solventValue = 1000 - totalAmount; // Recalculates whenever ingredients change
    }


  function toggleEdit(id) {
    activeEditId = activeEditId === id ? null : id; // Toggle edit mode on and off
  }

  async function handleDeleteIngredient(ingredientId) {
    let response = deleteIngredientFormulate(ingredientId);
    
    editedFormula.ingredients = editedFormula.ingredients.filter(
      (ingredient) => ingredient.id !== ingredientId,
    );
  }

  async function saveChanges() {
    // Save the changes to the server here...
    

    let updatedIngredients = editedFormula.ingredients.map((ingredient, i) => {
      
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
      editing = false;
      return updatedIngredient;
    });


    const formData = {
      name: editedFormula.name,
      description: editedFormula.description,
      notes: editedFormula.notes,
      ingredients: updatedIngredients,
      solvent: editedFormula.solvent,
    };
    editing = false;
    

    let data = await saveChangesFormula(formData, editedFormula.id);
    editedFormula = null;
    

    
    formulaDetail = data;
    
  }

  function addIngredient() {
    
    // Create a new ingredient object
    let newIngredient = {
      id: `new-${ingredientCounter}`, // Use the counter to generate a unique id
      ingredient: "", // Set the initial ingredient to an empty string
      volatility: "", // Set the initial volatility to an empty string
      amount: 0, // Set the initial amount to 0
      percentage: 10, // Set the initial percentage to 0
    };

    // Push the new ingredient to the editedFormula.ingredients array
    editedFormula.ingredients.push(newIngredient);

    // Reassign the array to trigger a reactive update
    editedFormula.ingredients = [...editedFormula.ingredients];

    ingredientCounter++; // Increment the counter

    activeEditId = newIngredient.id; // Set the active edit ID to the new ingredient ID
  }

</script>


<div id="description-etc" class="flex flex-col w-[220px] mr-auto h-full space-y-4 bg-lime-600 text-lime-50 dark:bg-lime-800 rounded-lg shadow p-4 z-20">
    <div>
      <h3 class="text-sm">description </h3>
      <textarea class="w-full p-0 focus:ring-0 border-none ring-0 bg-lime-600 rounded-lg" bind:value={editedFormula.description} />
    </div>  
      <div>
        <h3 class="text-sm">notes </h3>
        <textarea class="w-full p-0 focus:ring-0 border-none ring-0 bg-lime-600 rounded-lg" bind:value={editedFormula.notes} />
      </div>
      
    <div id="controls" class="pt-4 *:hover:p-2 *:rounded-full">
      <button tabindex="-1" class="hover:p-2 hover:bg-white hover:text-lime-950 rounded-full  dark:hover:text-lime-300 transition-all hover:scale-110"
      title="save changes"
      on:mousedown={saveChanges}>
        <OkIcon />
      </button>
      <button tabindex="-1" class="hover:p-2 hover:bg-white hover:text-lime-950 rounded-full  dark:hover:text-lime-300 transition-all hover:scale-110"

      title="cancel changes"
        on:mousedown={() => {
          editing = false;
          editedFormula = null;
        }}>
        <CancelButton />
        
        </button
      >
      
      
    </div>
  </div>
  <div id="table-wrapper" class="flex flex-col items-start justify-start p-4 ml-4 size-full z-10 scroll-m-2 overflow-y-auto">
  <input class="text-6xl p-0 tracking-tighter mb-4 dark:bg-lime-800 focus:ring-0 ring-0 border-none" bind:value={editedFormula.name} />
  <table id="formula-ingredient-table" class="table-fixed lowercase text-left w-full m-2 pl-2">
    <thead>
      <tr class="">
        <th class="w-1/12"></th>
        <th class="w-1/3"> Ingredient </th>
        <th class="w-1/6"> Volatility </th>
        <th class="w-1/6"> Amount </th>
        <th class="w-1/6"> % </th>
      </tr>
    </thead>
    <tbody>
      {#if editedFormula.ingredients}
        {#each editedFormula.ingredients as ingredient, i (ingredient.id)}
        <tr class="">
          <td class="align-middle">
            <button tabindex="-1" class="p-2 hover:bg-lime-700 hover:text-lime-50 rounded-full  dark:hover:text-lime-300 transition-all hover:scale-110" on:mousedown={() => handleDeleteIngredient(ingredient.id)}
              >
              <CrossIcon />
              </button
            >
          </td> 
          <td>
            {#if activeEditId === ingredient.id}
            <Dropdown bind:selectedIngredient={ingredient} searchTerm={ingredient.ingredient}/>
          {:else}
            <button tabindex="-1" on:mousedown={() => toggleEdit(ingredient.id)}>{ingredient.ingredient}</button>
          {/if}
          </td>

            <td class="cursor-not-allowed">{ingredient.volatility}</td> <!-- unchangeable -->

            <td>
              <input type="number" bind:value={ingredient.amount} class="flex w-2/3 dark:bg-lime-800 focus:ring-0 text-lime-700 rounded-lg border-none"/>
            </td>
            <td>
              <input type="number" bind:value={ingredient.percentage} class="flex w-2/3 dark:bg-lime-800 focus:ring-0 text-lime-700 rounded-lg border-none"/>
            </td>

          
        </tr>
        {/each}
        
      {/if}
      <td colspan="5" class="align-middle">
        <button tabindex="-1" class="p-2 my-2 mx-auto hover:bg-lime-700 rounded-full hover:text-lime-50 dark:hover:text-lime-300 transition-all hover:scale-110" on:mousedown={addIngredient}>
          <AddCrossIcon />
        </button>
      </td>
      
        <tr id="functional" class="border-t border-lime-950/20 dark:border-lime-100/10">
          <td></td>
          <td>
            <input type="text" bind:value={editedFormula.solvent} placeholder="solvent" 
            class="flex w-2/3 dark:bg-lime-800 focus:ring-0 text-lime-700 rounded-lg border-none"/>
          </td>
          <td>solvent</td>
          <td class="{solventValue < 0 ? 'text-red-700' : ''}">{solventValue}</td>
          <td>100</td>
        </tr>
    </tbody>


  </table>
</div>