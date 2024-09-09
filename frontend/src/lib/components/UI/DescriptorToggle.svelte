<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let showFilterMenu: boolean;

  function toggleFilterMenu() {
    dispatch("toggleFilterMenu");
  }
</script>

<button
  on:mousedown={toggleFilterMenu}
  title="filter by descriptors"
  class="hidden rounded-lg border border-gold-700 bg-gold-700 p-2 text-center text-gold-50 shadow transition-all hover:bg-white hover:text-gold-700 hover:shadow-lg active:shadow-none md:flex dark:hover:bg-stone-800 dark:hover:text-stone-50"
>
  {#if showFilterMenu}
    ingredients
  {:else}
    descriptors
  {/if}
</button>
