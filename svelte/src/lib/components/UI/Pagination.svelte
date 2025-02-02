<script lang="ts">
  import { ArrowLeft, ArrowRight } from "lucide-svelte";
  import { currentPage } from "$lib/stores";
</script>

<div
  id="pagination"
  class="border-gold-400 bg-gold-700 text-gold-50 hover:text-gold-700 dark:border-gold-900 flex w-[80px] items-center justify-between rounded-full border p-2 shadow transition-colors hover:bg-white active:shadow-none dark:hover:bg-stone-800 dark:hover:text-stone-50
      "
>
  <button
    id="prevPage"
    onclick={currentPage.decrease}
    class="hover:bg-gold-400 dark:hover:bg-gold-700 rounded-full p-1 transition-colors"
  >
    <ArrowLeft />
  </button>

  <button
    id="nextPage"
    onclick={currentPage.increase}
    class="hover:bg-gold-400 dark:hover:bg-gold-700 rounded-full p-1 transition-colors"
  >
    <ArrowRight />
  </button>
</div>
