<script lang="ts">
  import ArrowLeftIcon from "$lib/icons/ArrowLeftIcon.svelte";
  import ArrowRightIcon from "$lib/icons/ArrowRightIcon.svelte";
  import { ArrowLeft, ArrowRight } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";

  const dispatcher = createEventDispatcher();

  function handleClick(increment: number) {
    if (increment === 1) {
      dispatcher("nextPage");
    } else {
      dispatcher("prevPage");
    }
  }
</script>

<div
  id="pagination"
  class="flex w-[80px] items-center justify-between rounded-full border border-gold-400 bg-gold-700 p-2 text-gold-50 shadow transition-colors hover:bg-white hover:text-gold-700 active:shadow-none dark:border-gold-900 dark:hover:bg-stone-800 dark:hover:text-stone-50
      "
>
  <button
    id="prevPage"
    on:click|preventDefault={() => handleClick(-1)}
    class="rounded-full p-1 transition-colors hover:bg-gold-400 dark:hover:bg-gold-700"
  >
    <ArrowLeft />
  </button>

  <button
    id="nextPage"
    on:click|preventDefault={() => handleClick(1)}
    class="rounded-full p-1 transition-colors hover:bg-gold-400 dark:hover:bg-gold-700"
  >
    <ArrowRight />
  </button>
</div>
