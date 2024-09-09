<script lang="ts">
  import ResetIcon from "$lib/icons/ResetIcon.svelte";
  import { notification } from "$lib/stores";
  import { createEventDispatcher } from "svelte";
  import { currentPage, searchTerm } from "$lib/stores";

  const dispatch = createEventDispatcher();

  function reset() {
    notification.set({
      message: "Resetting everything",
      type: "info",
    });

    searchTerm.set("");
    currentPage.set(1);

    dispatch("reset");
  }
</script>

<button
  on:mousedown|preventDefault={reset}
  title="reset everything"
  class="hidden rounded-full border border-gold-900 bg-gold-700 p-2 text-gold-50 shadow transition-all hover:bg-white hover:text-gold-700 hover:shadow-lg active:shadow-none sm:block dark:hover:bg-stone-800"
>
  <ResetIcon />
</button>
