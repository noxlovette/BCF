
<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let searchInput: HTMLInputElement | null = null;
  export let placeholder: string = "/ search ingredients...";
  export let value;

  function handleSearch() {
  dispatch("search" );
  }

  function handleBlur() {
    dispatch("blur");
  }



</script>

<input
      type="text"
      class="w-full rounded-lg border-none bg-white shadow transition-all hover:shadow-lg focus:scale-95 focus:ring-2 focus:ring-grapefruit-700/60 active:scale-90 md:w-1/2 dark:bg-stone-800 {$$props.class}"
      bind:value={$value}
      bind:this={searchInput}
      on:change={handleSearch}
      on:blur={handleBlur}
      placeholder={placeholder}
      title="find an ingredient by CAS or the multiple names that it might have"
    />

    