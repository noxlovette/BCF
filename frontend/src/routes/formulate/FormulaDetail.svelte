<script>
    import { addFormulaAsCustomIngredient, deleteFormula} from "$lib/DjangoAPI.ts";
    import FormulaEdit from "./FormulaEdit.svelte";


    export let formulaDetail;
    export let userId;
    export let formulae;
    let solventValue = 0;
    let editing = false;
    let editedFormula = null;

    $: if (formulaDetail && formulaDetail.ingredients) {
        let totalAmount = formulaDetail.ingredients.reduce((acc, ingredient) => acc + ingredient.amount, 0);
        solventValue = 1000 - totalAmount; // Recalculates whenever ingredients change
    }

  async function handleAddAsCustom (formulaDetail) {
    const response = await addFormulaAsCustomIngredient(userId, formulaDetail);
    notification.set(response)
  }

  async function addTag(formulaId) {
    console.log("Adding tag", formulaId);
    notification.set("this doesn't work yet");
  }

  function editFormula(formula) {
    editing = true;
    editedFormula = formula;
    console.log("Editing formula", editedFormula);
  }

  async function handleDeleteFormula(formulaId) {
    let data = await deleteFormula(userId, formulaId);
    console.log(data);
    // Remove the deleted formula from the formulae array
    formulae = formulae.filter((formula) => formula.id !== formulaId);
  }

</script>

{#if editing}
    <FormulaEdit {formulaDetail} {editedFormula} {userId} bind:editing bind:solventValue />
{:else}

<div id="description-etc" class="flex flex-col mr-auto w-1/4 p-4 h-full divide-y-4 divide-amber-800/60 dark:divide-amber-50/60 space-y-4 bg-amber-50/80 dark:bg-amber-800/20 rounded-lg shadow">
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
          <button class=" hover:text-lime-800/70 dark:hover:text-lime-300/60 transition-all hover:scale-110" on:click={() => handleDeleteFormula(formulaDetail.id)} title="delete the formula">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
          <button class=" hover:text-lime-700/80 dark:hover:text-lime-300/60 transition-all hover:scale-110" on:click={() => handleAddAsCustom(formulaDetail)} title="add the formula to collection as ingredient">
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
  <div id="table-wrapper" class="flex flex-col items-start justify-start m-2 pl-2 size-full">
  <h2 class="text-6xl tracking-widest mb-4">{formulaDetail.name}</h2>
  <table id="formula-ingredient-table" class="table-fixed text-left w-full">
    <thead>
      <tr class="2">
        <th class="w-1/12">#</th>
      <th class="w-1/3"> Ingredient </th>
      <th class="w-1/6"> Volatility </th>
      <th class="w-1/6"> Amount </th>
      <th class="w-1/6"> % </th>
      </tr>
    </thead>
    <tbody class="rounded-lg">
      {#each formulaDetail.ingredients as ingredient, i (ingredient.id)}
        <tr class="">
          <td>{i + 1}</td>
          <td>{ingredient.ingredient}</td>
          <td>{ingredient.volatility}</td>
          <td>{ingredient.amount}</td>
          <td>{ingredient.percentage}</td>
        </tr>
      {/each}
      <tr id="functional" class="border-t border-amber-950/20 dark:border-amber-100/10">
        <td class="">x</td>
        <td class="">alcohol</td>
        <td class="">solvent</td>
        <td class="{solventValue < 0 ? 'text-red-700/80 dark:text-red-500/80' : ''}">{solventValue}</td>
        <td class="">100</td>
      </tr>
    </tbody>
  </table>
</div>
{/if}