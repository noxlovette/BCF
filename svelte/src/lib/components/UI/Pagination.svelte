<script lang="ts">
  import { ArrowLeft, ArrowRight } from "lucide-svelte";
  import { currentPage } from "$lib/stores";

  let canGoBack = $derived($currentPage > 1);
</script>

<div
  id="pagination"
  class="border-gold-400 dark:border-gold-900 flex items-center space-x-4 rounded-lg border-2 bg-white p-2
         shadow-sm transition-all duration-300 dark:bg-zinc-900"
>
  <button
    id="prevPage"
    onclick={currentPage.decrease}
    disabled={!canGoBack}
    class="rounded-full p-2 transition-colors
           {canGoBack
      ? 'hover:bg-gold-100 dark:hover:bg-gold-800/30'
      : 'cursor-not-allowed opacity-50'}"
    aria-label="Previous page"
  >
    <ArrowLeft />
  </button>

  <span class="font-medium">
    Page {$currentPage}
  </span>

  <button
    id="nextPage"
    onclick={currentPage.increase}
    class="hover:bg-gold-100 dark:hover:bg-gold-800/30 rounded-full
           p-2 transition-colors"
    aria-label="Next page"
  >
    <ArrowRight />
  </button>
</div>
