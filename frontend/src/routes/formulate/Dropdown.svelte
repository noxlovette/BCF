<script lang="ts">
  import { fetchCollection } from "$lib/DjangoAPI";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  let searchInput;

  export let searchTerm = "";
  let collection = [];
  let filteredCollection = [];
  export let selectedIngredient = null;
  let isDropdownVisible = true;
  let highlightedIndex = 0;

  onMount(async () => {
    collection = await fetchCollection();

    if (searchInput) {
      searchInput.focus(); // Focus on the input element when the component mounts
    }
  });

  function handleKeydown(event) {
    switch (event.key) {
      case "Escape":
        isDropdownVisible = false;
        searchInput.blur();
        break;
      case "Enter":
        if (
          filteredCollection.length > 0 &&
          highlightedIndex < filteredCollection.length
        ) {
          selectItem(filteredCollection[highlightedIndex]);
          isDropdownVisible = false; // Optionally close dropdown
        }
        break;
      case "ArrowDown":
        if (highlightedIndex < filteredCollection.length - 1) {
          highlightedIndex++;
        } else {
          highlightedIndex = 0; // Optionally wrap around to the top
        }
        event.preventDefault(); // Prevent the default action (scrolling the page)
        break;
      case "ArrowUp":
        if (highlightedIndex > 0) {
          highlightedIndex--;
        } else {
          highlightedIndex = filteredCollection.length - 1; // Optionally wrap around to the bottom
        }
        event.preventDefault(); // Prevent the default action
        break;
    }
  }

  const searchDropdown = (event) => {
    searchTerm = event.target.value;

    filteredCollection = collection.filter((ingredient) => {
      const commonName = ingredient.common_name || "";
      const cas = ingredient.cas || "";
      return (
        commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cas.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    return filteredCollection;
  };

  function selectItem(item) {
    searchTerm = item.common_name;
    selectedIngredient.ingredient = item.common_name;
    selectedIngredient.volatility = item.volatility;
    selectedIngredient.solubility = item.solubility;
    if (item.type === "CustomCollectionIngredient") {
      selectedIngredient.custom_collection_ingredient_id = item.id;
      selectedIngredient.collection_ingredient_id = null;
    } else {
      selectedIngredient.collection_ingredient_id = item.id;
      selectedIngredient.custom_collection_ingredient_id = null;
    }

    isDropdownVisible = false;
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="relative">
  <input
    type="text"
    class="flex w-5/6 rounded border-none p-1 text-aqua-700 focus:ring-0 dark:bg-stone-800 dark:text-stone-50"
    bind:value={searchTerm}
    bind:this={searchInput}
    placeholder="something new"
    on:input={searchDropdown}
    on:focus={() => (isDropdownVisible = true)}
    in:fade={{ duration: 150 }}
  />
  {#if isDropdownVisible && filteredCollection.length !== 0 && filteredCollection.length < 5}
    <ul
      class="absolute z-10 mt-1 w-5/6 space-y-2 rounded bg-aqua-600 p-2 text-aqua-50 shadow-lg"
    >
      {#each filteredCollection as item (item.common_name)}
        <button
          class="dropdown-item w-full rounded border-none p-2 text-left hover:bg-aqua-700 focus:ring-0 dark:bg-aqua-800"
          on:mousedown={() => selectItem(item)}
        >
          {item.common_name}
        </button>
      {/each}
    </ul>
  {/if}
</div>
