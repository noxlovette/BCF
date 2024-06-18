<script lang="ts">
  import DeleteIcon from "$lib/icons/DeleteIcon.svelte";
  import { deleteFromCollection } from "$lib/DjangoAPI";
  import { onMount } from "svelte";
  import { notification } from "$lib/stores/notificationStore";

  let is_authenticated = null;
  export let ingredient: any = {};
  export let chosenIngredient: any = null;
  export let filteredCollection = [];

  onMount(async () => {
    is_authenticated = sessionStorage.getItem("is_authenticated");
  });

  // delete ingredient, custom or otherwise
  /**
   * @param {MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }} ingredient
   */
  async function handleDeleteClick(ingredient) {
    const response = await deleteFromCollection(ingredient);

    try {
      filteredCollection = filteredCollection.filter(
        (ingredientInside) => ingredientInside.id !== ingredient.id,
      );
      notification.set({ message: response, type: "success" });
    } catch (error) {
      notification.set({ message: error, type: "error" });
    }
  }
</script>

<button
  id="card-small"
  class="group min-h-[160px] rounded-lg bg-white p-8 text-left shadow-md transition-all hover:scale-105 hover:bg-rose-800 hover:text-rose-50 hover:shadow-lg dark:bg-stone-800"
  on:mousedown={() => (chosenIngredient = ingredient)}
  tabindex="0"
>
  <div id="top-part" class="flex flex-row items-baseline">
    <h1
      id="top-left"
      class="mr-8 truncate text-3xl font-bold tracking-tighter text-rose-800 group-hover:text-rose-50"
    >
      {ingredient.common_name}
    </h1>
    <h2
      id="top-right"
      class="ml-auto min-w-fit text-clip opacity-60 group-hover:text-rose-200/60"
    >
      {ingredient.cas}
    </h2>
  </div>
  <div id="bottom-part" class="mt-4 flex flex-row">
    <div id="bottom-left" class="mr-auto flex w-2/3 flex-col">
      <p class="mr-8 h-[100px] text-clip text-left normal-case">
        {#if ingredient.impression}
          {ingredient.impression}
        {:else}
          Time to record your impression!
        {/if}
      </p>
      <h2
        class="justify-start lowercase opacity-60 group-hover:text-rose-200/60"
      >
        {#if ingredient.colour}
          {ingredient.colour}
        {:else}
          colour
        {/if}
      </h2>
    </div>
    <div
      id="bottom-right"
      class="ml-auto mt-auto flex flex-1 flex-col items-end"
    >
      <button
        class="invisible items-baseline rounded-full p-2 hover:bg-rose-50 hover:text-rose-700 hover:transition-all group-hover:visible"
        on:mousedown={() => handleDeleteClick(ingredient)}
        on:mousedown|stopPropagation
      >
        <DeleteIcon />
      </button>
    </div>
  </div>
</button>
