<script lang="ts">
  import { searchTerm, currentPage } from "$lib/stores";
  import { X } from "lucide-svelte";

  let value = $state($searchTerm);
  let { placeholder = "Search Ingredients..." } = $props();
  let focused = $state(false);

  function handleSearch() {
    searchTerm.set(value);
    currentPage.set(1);
  }
  function handleFocus() {
    focused = true;
  }

  function handleBlur() {
    focused = false;
  }
</script>

<form
  id="search-bar"
  action="?search={$searchTerm}"
  class="relative flex w-full md:w-1/2"
>
  <input
    type="text"
    class="border-gold-400 w-full rounded-lg border-2 bg-stone-50 px-4 py-3
           shadow transition-all duration-300
           {focused
      ? 'ring-gold-700/60 border-gold-200 ring-2'
      : 'hover:border-gold-300'}
           dark:border-gold-900 dark:bg-stone-900 dark:placeholder-stone-500"
    bind:value
    oninput={handleSearch}
    onfocus={handleFocus}
    onblur={handleBlur}
    {placeholder}
    title="Find an ingredient by CAS or name"
  />
  {#if value}
    <button
      type="button"
      class="absolute top-1/2 right-3 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:text-stone-600 dark:hover:text-stone-400"
      onclick={() => {
        searchTerm.set("");
        value = "";
      }}
    >
      <X />
    </button>
  {/if}
</form>
