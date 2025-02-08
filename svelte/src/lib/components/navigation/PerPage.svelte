<script lang="ts">
  import { pageSize } from "$lib/stores";

  const pageSizeOptions = [10, 20, 50, 100];
</script>

<select
  bind:value={$pageSize}
  class="border-saffron-400 focus:ring-saffron-400/70 dark:border-saffron-900 dark:focus:border-saffron-400 hidden w-36 rounded-lg border-2 bg-stone-50 shadow-sm transition-all duration-300 focus:ring-2 md:flex dark:bg-stone-800"
  aria-label="Items per page"
>
  {#each pageSizeOptions as size}
    <option value={size}>{size} per page</option>
  {/each}
</select>
