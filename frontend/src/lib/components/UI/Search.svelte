<script lang="ts">
  import { createEventDispatcher, SvelteComponent } from "svelte";
  import { searchTerm } from "$lib/stores";

  const dispatch = createEventDispatcher();

  export let searchInput: HTMLInputElement | null = null;
  export let placeholder: string = "/ search ingredients...";
  export let value = searchTerm;

  function handleSearch() {
    dispatch("search");
  }

  function handleBlur() {
    dispatch("blur");
  }
</script>

<input
  type="text"
  class="w-full rounded border-gold-400 bg-stone-50 shadow transition-all hover:shadow-lg focus:border-gold-200 focus:ring-2 focus:ring-gold-700/60 md:w-1/2 dark:border-gold-900 dark:bg-stone-800 {$$props.class}"
  bind:value={$value}
  bind:this={searchInput}
  on:change={handleSearch}
  on:blur={handleBlur}
  {placeholder}
  title="find an ingredient by CAS or the multiple names that it might have"
/>
