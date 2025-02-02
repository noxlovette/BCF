<script lang="ts">
  import { pageSize } from "$lib/stores";
</script>

<label
  class="group hidden items-center space-x-2 opacity-80 transition-opacity hover:opacity-100 md:flex"
  aria-label="Items per page"
>
  <input
    type="number"
    class="border-gold-400 focus:border-gold-400 focus:ring-gold-400/70 dark:border-gold-900 dark:focus:border-gold-400 dark:focus:ring-gold-400/70 w-16 rounded border bg-stone-50 px-2 py-2 shadow-sm transition-all duration-300 focus:ring-2 dark:bg-stone-800"
    min="1"
    bind:value={$pageSize}
    aria-describedby="page-size-tooltip"
    placeholder="10"
  />
  <span class="md:text-md text-sm text-stone-700 dark:text-stone-300"
    >per page</span
  >
</label>
