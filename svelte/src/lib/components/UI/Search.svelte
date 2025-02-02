<script lang="ts">
  import { searchTerm, currentPage } from "$lib/stores";
  let value = $state($searchTerm);

  let { placeholder = "Search Ingredients..." } = $props();

  function handleSearch() {
    searchTerm.set(value);
    currentPage.set(1);
  }
</script>

<form
  id="search-bar"
  action="?search={$searchTerm}"
  class="flex w-full md:w-1/2"
>
  <input
    type="text"
    class="border-gold-400 focus:border-gold-200 focus:ring-gold-700/60 dark:border-gold-900 w-full rounded bg-stone-50 shadow transition-all hover:shadow-lg focus:ring-2 dark:bg-stone-900"
    bind:value
    oninput={handleSearch}
    {placeholder}
    title="find an ingredient by CAS or the multiple names that it might have"
  />
</form>
