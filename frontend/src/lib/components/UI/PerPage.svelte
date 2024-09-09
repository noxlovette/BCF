<script lang="ts">
  import { pageSize } from "$lib/stores";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  function updatePageSize() {
    dispatch("updatePageSize");
  }
</script>

<label
  class="group flex items-center space-x-2 opacity-80 transition-opacity hover:opacity-100"
  aria-label="Items per page"
>
<input
type="number"
class="w-16 px-3 py-2 rounded-lg border border-stone-300 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/70 shadow-sm transition-all duration-300 dark:bg-stone-800 dark:border-stone-700 dark:focus:border-gold-400 dark:focus:ring-gold-400/70"
min="1"
bind:value={$pageSize}
on:change={updatePageSize}
aria-describedby="page-size-tooltip"
placeholder="10"
/>
<span class="text-sm text-stone-700 dark:text-stone-300 md:text-md">per page</span>
  
</label>
