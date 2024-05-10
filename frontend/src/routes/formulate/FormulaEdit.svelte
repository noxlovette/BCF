<script>

    import {saveChangesFormula, deleteIngredientApi } from "$lib/DjangoAPI.ts";
    import Dropdown from "./Dropdown.svelte";
    export let editedFormula = null;
    export let formulaDetail = null;
    export let userId = 0;
    export let editing = true;
    let solventValue = 0;
    let activeEditId = null;
    let ingredientCounter = 0;

    $: if (editedFormula&& editedFormula.ingredients) {
        let totalAmount = editedFormula.ingredients.reduce((acc, ingredient) => acc + ingredient.amount, 0);
        solventValue = 1000 - totalAmount; // Recalculates whenever ingredients change
    }


  function toggleEdit(id) {
    activeEditId = activeEditId === id ? null : id; // Toggle edit mode on and off
  }

  async function deleteIngredient(ingredientId) {
    let response = deleteIngredientApi(userId, ingredientId);
    console.log(response);
    editedFormula.ingredients = editedFormula.ingredients.filter(
      (ingredient) => ingredient.id !== ingredientId,
    );
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
      editing = false;
      return updatedIngredient;
    });
    
    console.log(updatedIngredients)

    const formData = {
      user: userId,
      name: editedFormula.name,
      description: editedFormula.description,
      notes: editedFormula.notes,
      ingredients: updatedIngredients,
    };
    editing = false;
    

    let data = await saveChangesFormula(userId, formData, editedFormula.id);
    editedFormula = null;
    console.log("updated formula", data);

    
    formulaDetail = data;
    
  }

  function addIngredient() {
    console.log("Adding ingredient");
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


<div id="description-etc" class="flex flex-col mr-auto w-1/4 p-4 h-full divide-y-4 divide-amber-800/60 dark:divide-amber-50/60 space-y-4 dark:bg-amber-800/20 bg-amber-50/80 rounded-lg shadow">
    <div>
      <h3 class="font-bold">description: </h3>
      <textarea class="flex w-full bg-amber-300/20 dark:bg-amber-950/30  focus:ring-amber-700/70 focus:ring-2 rounded-lg border-none" bind:value={editedFormula.description} />
    </div>  
      <div>
        <h3 class="font-bold">notes: </h3>
        <textarea class="flex w-full bg-amber-300/20 dark:bg-amber-950/30  focus:ring-amber-700/70 focus:ring-2 rounded-lg border-none" bind:value={editedFormula.notes} />
      </div>
      
    <div id="controls" class="pt-4">
      <button tabindex="-1" class=" hover:text-lime-800/70 dark:hover:text-lime-300/60 transition-all hover:scale-110" on:click={saveChanges}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-amber-950/60 dark:hover:text-amber-400/60">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </button>
      <button tabindex="-1" class=" hover:text-lime-800/70 dark:hover:text-lime-300/60 transition-all hover:scale-110"
        on:click={() => {
          editing = false;
          editedFormula = null;
        }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-amber-950/60 dark:hover:text-amber-400/60">
          <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        
        </button
      >
      
      
    </div>
  </div>
  <div id="table-wrapper" class="flex flex-col items-start m-2 pl-2 w-full">
  <input class="flex w-full text-6xl tracking-widest bg-amber-300/20 dark:bg-amber-950/30  focus:ring-amber-700/70 focus:ring-2 rounded-lg border-none" bind:value={editedFormula.name} />
  <table id="formula-ingredient-table" class="table-fixed text-left w-full m-2 pl-2">
    <thead>
      <tr class="">
        <th class="w-1/12">#</th>
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
            <button tabindex="-1" class=" hover:text-lime-800/70 dark:hover:text-lime-300/60 transition-all hover:scale-110" on:click={() => deleteIngredient(ingredient.id)}
              ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-amber-300/60">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              </button
            >
          </td> 
          <td>
            {#if activeEditId === ingredient.id}
            <Dropdown bind:selectedIngredient={ingredient} {userId} searchTerm={ingredient.ingredient}/>
          {:else}
            <button tabindex="-1" on:click={() => toggleEdit(ingredient.id)}>{ingredient.ingredient}</button>
          {/if}
          </td>

            <td>{ingredient.volatility}</td> <!-- unchangeable -->

            <td>
              <input type="number" bind:value={ingredient.amount} class="flex w-2/3 bg-amber-50/20 dark:bg-amber-950/30  focus:ring-amber-700/70 focus:ring-2 rounded-lg border-none"/>
            </td>
            <td>
              <input type="number" bind:value={ingredient.percentage} class="flex w-2/3 bg-amber-50/20 dark:bg-amber-950/30  focus:ring-amber-700/70 focus:ring-2 rounded-lg border-none"/>
            </td>

          
        </tr>
        {/each}
        
      {/if}
      <td>
        <button tabindex="-1" on:click={addIngredient}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          
        </button>
        </td>
        <tr id="functional" class="border-t border-amber-950/20 dark:border-amber-100/10">
          <td>x</td>
          <td>alcohol</td>
          <td>solvent</td>
          <td class="{solventValue < 0 ? 'text-red-700/80' : ''}">{solventValue}</td>
          <td>100</td>
        </tr>
    </tbody>


  </table>
</div>