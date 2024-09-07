<script lang="ts">
  import Add from "../icons/Add.svelte";
  import { onMount } from "svelte";
  import { notification } from "$lib/stores/notificationStore";
  import { addToCollectionBrowse } from "$lib/DjangoAPI";

  let is_authenticated = null;
  export let ingredient: any = {};
  export let chosenIngredient: any = null;

  onMount(async () => {
    is_authenticated = sessionStorage.getItem("is_authenticated");
  });

  async function handleAddIngredient(ingredientId: number) {
    if (is_authenticated !== null) {
      try {
        const response = await addToCollectionBrowse(ingredientId);
        if (response === "ingredient is already in collection") {
          notification.set({
            message: "Ingredient already in collection",
            type: "error",
          });
          return;
        }
        notification.set({ message: response, type: "success" });
      } catch (error) {
        notification.set({
          message: "Failed to add ingredient to collection",
          type: "error",
        });
      }
    } else {
      notification.set({
        message:
          "You need to be logged in to add ingredients to your collection",
        type: "error",
      });
    }
  }
</script>

<button
  id="card-small"
  class="group flex flex-col rounded-lg bg-white p-4  md:p-8 text-left shadow-lg transition-all hover:scale-105 hover:bg-navy-700 hover:text-navy-50 hover:shadow-lg dark:bg-stone-800 items-start justify-between"
  on:mousedown={() => (chosenIngredient = ingredient)}
  tabindex="0"
>
  <div id="top-part" class="flex flex-row items-baseline justify-between w-full">
    <h1
      id="top-left"
      class="mr-8 hyphens-auto text-xl md:text-3xl font-bold tracking-tighter text-navy-800 dark:text-navy-600 group-hover:text-navy-50 max-w-[65%] overflow-clip"
    >
      {ingredient.common_name}
    </h1>
    <h2
      id="top-right"
      class="ml-auto min-w-fit text-clip hidden md:flex opacity-60 group-hover:text-navy-200/60"
    >
      {ingredient.cas}
    </h2>
  </div>
  <div id="bottom-part" class="mt-2 md:mt-4 flex flex-row">
    <div id="bottom-left" class="mr-auto flex md:w-2/3 flex-col">
      <p class="hidden md:flex md:mr-8 h-[100px] text-left normal-case overflow-clip">
        {#if ingredient.use}
          {ingredient.use}
        {:else}
          Know how to use this? Submit a suggestion!
        {/if}
      </p>
      <p class="md:hidden  min-w-fit opacity-60 text-navy-900">
      {ingredient.cas}
    </p>
      <h2
        class="justify-start mt-auto lowercase opacity-60 group-hover:text-navy-200/60"
      >
        {ingredient.descriptors}
      </h2>
    </div>
    <div
      id="bottom-right"
      class="ml-auto mt-auto hidden md:flex flex-1 flex-col items-end"
    >
      <button
        class="invisible items-baseline rounded-full p-2 hover:bg-navy-50 hover:text-navy-700 hover:transition-all group-hover:visible"
        on:mousedown={() => handleAddIngredient(ingredient.id)}
        on:mousedown|stopPropagation
      >
        <Add />
      </button>
    </div>
  </div>
</button>
