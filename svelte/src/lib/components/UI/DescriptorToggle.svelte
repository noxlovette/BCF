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
  class="border-gold-400 bg-gold-700 text-gold-50 hover:text-gold-700 dark:border-gold-900 hidden rounded-full border p-2 text-center shadow transition-colors hover:bg-white hover:shadow-lg active:shadow-none md:flex dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
>
  {#if showFilterMenu}
    <Squares />
  {:else}
    <Tag />
  {/if}
</button>
