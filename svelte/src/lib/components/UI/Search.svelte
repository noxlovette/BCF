<script lang="ts">
  import { searchTerm, currentPage } from "$lib/stores";

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
    class="border-gold-400 w-full rounded-lg border-2 bg-zinc-50 px-4 py-3
           shadow transition-all duration-300
           {focused
      ? 'ring-gold-700/60 border-gold-200 ring-2'
      : 'hover:border-gold-300'}
           dark:border-gold-900 dark:bg-zinc-900 dark:placeholder-zinc-500"
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
      class="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400"
      onclick={() => {
        searchTerm.set("");
      }}
    >
      ×
    </button>
  {/if}
</form>
