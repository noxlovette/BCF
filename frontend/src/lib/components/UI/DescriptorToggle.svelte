<script lang="ts">
  import Squares from "$lib/icons/Squares.svelte";
  import Tag from "$lib/icons/Tag.svelte";
  import { notification } from "$lib/stores";

  export let showFilterMenu: boolean;

  function toggleFilterMenu() {
    showFilterMenu = !showFilterMenu;
    notification.set({
      message: showFilterMenu
        ? "Filtering by Descriptors"
        : "Showing Ingredients",
      type: "info",
    });
  }
</script>

<button
  on:mousedown|preventDefault={toggleFilterMenu}
  title="filter by descriptors"
  class="hidden rounded-full border border-gold-400 bg-gold-700 p-2 text-center text-gold-50 shadow transition-colors hover:bg-white hover:text-gold-700 hover:shadow-lg active:shadow-none md:flex dark:border-gold-900 dark:hover:bg-stone-800 dark:hover:text-stone-50"
>
  {#if showFilterMenu}
    <Squares />
  {:else}
    <Tag />
  {/if}
</button>
