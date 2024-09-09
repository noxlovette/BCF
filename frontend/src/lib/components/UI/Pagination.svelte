<script lang="ts">
  import ArrowLeftIcon from "$lib/icons/ArrowLeftIcon.svelte";
  import ArrowRightIcon from "$lib/icons/ArrowRightIcon.svelte";
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
  class="flex w-[80px] items-center justify-between rounded-full transition-colors border border-gold-700 bg-gold-700 p-2 text-gold-50 shadow hover:bg-white hover:text-gold-700 active:shadow-none dark:hover:bg-stone-800 dark:hover:text-stone-50
      "
>
  <button id="prevPage" on:click|preventDefault={() => handleClick(-1)} class="p-1 hover:bg-gold-700 rounded-full transition-colors">
    <ArrowLeftIcon />
  </button>

  <button id="nextPage" on:click|preventDefault={() => handleClick(1)} class="p-1 hover:bg-gold-700 rounded-full transition-colors">
    <ArrowRightIcon />
  </button>
</div>
