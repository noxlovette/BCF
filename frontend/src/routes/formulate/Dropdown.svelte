<script lang="ts">
    import { fetchCollection } from "$lib/DjangoAPI";
    import {fade} from "svelte/transition";
    import {onMount} from "svelte";
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
        searchInput.focus();  // Focus on the input element when the component mounts
    }
    });

    function handleKeydown(event) {
    switch (event.key) {
      case "Escape":
        isDropdownVisible = false;
        searchInput.blur();
        break;
      case "Enter":
        if (filteredCollection.length > 0 && highlightedIndex < filteredCollection.length) {
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
      
      filteredCollection = collection.filter(ingredient => {
        const commonName = ingredient.common_name || '';
        const cas = ingredient.cas || '';
        console.log(commonName, cas)
        return commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cas.toLowerCase().includes(searchTerm.toLowerCase());
    });
  return filteredCollection;
    }
  
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

<svelte:window on:keydown={handleKeydown}/>
  
<div>
  <input
    type="text"
    class="flex w-5/6 bg-amber-300/20 dark:bg-amber-950/30 focus:ring-amber-700/70 focus:dark:ring-amber-200/70 focus:ring-2 text-amber-700/80 dark:text-amber-200/80 rounded-lg border-none"
    bind:value={searchTerm}
    bind:this={searchInput}
    placeholder="something new"
    on:input={searchDropdown}
    on:focus = {() => isDropdownVisible = true}
    in:fade={{duration: 150}}
  />
  {#if isDropdownVisible}
  <ul
    class="block bg-lime-800/20 rounded-lg shadow-lg items-center transition-all duration-150"
  >
    {#if filteredCollection.length !== 0 && filteredCollection.length < 5}
      {#each filteredCollection as item (item.common_name)}
        <button
          class="dropdown-item hover:bg-lime-800/60 rounded-lg hover:text-amber-100/90 dark:hover:text-amber-50/80 w-full font-light text-sm transition-all duration-150"
          on:mousedown={() => selectItem(item)}
        >{item.common_name}</button>
      {/each}
    {/if}
  </ul>
    {/if}
</div>