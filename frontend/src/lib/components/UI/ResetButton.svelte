<script lang="ts">
  import ResetIcon from "$lib/icons/ResetIcon.svelte";
  import { notification } from "$lib/stores";
  import { createEventDispatcher } from "svelte";
  import { currentPage, searchTerm } from "$lib/stores";
    import RoundButton from "./RoundButton.svelte";

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

<RoundButton on:click={reset}>
  <ResetIcon />
</RoundButton>

