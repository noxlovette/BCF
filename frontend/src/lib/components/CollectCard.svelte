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

<a
  id="card-small"
  class="group flex flex-col rounded-lg items-start justify-between bg-white p-4 md:p-8 text-left shadow-lg transition-all hover:scale-105 hover:bg-grapefruit-700 hover:text-grapefruit-50 hover:shadow-lg dark:bg-stone-800"
  href="/collect/{ingredient.uuid}"
  tabindex="0"
>
  <div id="top-part" class="flex flex-row items-baseline justify-between w-full">
    <h1
      id="top-left"
      class="mr-8 hyphens-auto text-3xl max-w-[65%] overflow-clip font-bold tracking-tighter text-grapefruit-800 group-hover:text-grapefruit-50"
    >
      {ingredient.common_name}
    </h1>
    <h2
      id="top-right"
      class="ml-auto min-w-fit text-clip hidden md:flex opacity-60 group-hover:text-grapefruit-200/60"
    >
      {ingredient.cas}
    </h2>
  </div>
  <div id="bottom-part" class="mt-2 md:mt-4 flex flex-row justify-between w-full">
    <div id="bottom-left" class="flex w-2/3 flex-col">
      <p class="hidden md:flex md:mr-8 h-[100px] text-left normal-case overflow-clip">
        {#if ingredient.impression}
          {ingredient.impression}
        {:else}
          Time to record your impression!
        {/if}
      </p>
      <h2
        class="justify-start mt-auto lowercase opacity-60 group-hover:text-grapefruit-200/60"
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
      class="mt-auto hidden md:flex flex-1 flex-col items-end justify-end"
    >
      <button
        class="invisible items-baseline rounded-full p-2 hover:bg-grapefruit-50 hover:text-grapefruit-700 hover:transition-all group-hover:visible"
        on:mousedown={() => handleDeleteClick(ingredient)}
        on:mousedown|stopPropagation
      >
        <DeleteIcon />
      </button>
    </div>
  </div>
</a>
