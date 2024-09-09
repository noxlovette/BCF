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

  export let totalPages = 10;
</script>

<div
  id="pagination"
  class="flex w-[100px] items-center justify-center rounded-full border border-gold-700 bg-gold-700 p-2 text-gold-50 shadow hover:bg-white hover:text-gold-700 active:shadow-none dark:hover:bg-stone-800 dark:hover:text-stone-50
      "
>
  <button id="prevPage" on:click|preventDefault={() => handleClick(-1)}>
    <ArrowLeftIcon />
  </button>

  <button id="nextPage" on:click|preventDefault={() => handleClick(1)}>
    <ArrowRightIcon />
  </button>
</div>
