<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { searchTerm, pageSize, currentPage } from "$lib/stores";
  import { goto } from "$app/navigation";
  import debounce from 'lodash/debounce';

  const dispatch = createEventDispatcher();

  export let searchInput: HTMLInputElement | null = null;
  export let placeholder: string = "/ search ingredients...";
  export let value = searchTerm;

  function handleSearch() {
    const params = new URLSearchParams();
    params.set('q', $searchTerm);
    params.set('s', $pageSize.toString());
    params.set('p', "1");
    goto(`?${params.toString()}`, { replaceState: true });
  }

  function handleFocus() {
    dispatch("focus");
  }
</script>

<form
  id="search-bar"
  action="?"
  on:submit|preventDefault={handleSearch}
  data-sveltekit-keepfocus
  class="w-full flex md:w-1/2"
>

<input
type="text"
class="w-full rounded border-gold-400 bg-stone-50 shadow transition-all hover:shadow-lg focus:border-gold-200 focus:ring-2 focus:ring-gold-700/60  dark:border-gold-900 dark:bg-stone-800 {$$props.class}"
name="q"
bind:value={$value}
bind:this={searchInput}
on:input={debounce(handleSearch, 800)}
on:focus={handleFocus}
on:blur={handleSearch}
{placeholder}
title="find an ingredient by CAS or the multiple names that it might have"
/>
<input name='s' type="number" class="hidden" bind:value={$pageSize} />
<input name='p' type="number" class="hidden" value=1 />
</form>