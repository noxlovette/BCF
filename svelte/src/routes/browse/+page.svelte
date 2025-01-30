<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { derived } from "svelte/store";
  import type { PageServerData } from "./$types";
  import { changePage, handleKeydown } from "$lib/utils";
  import BrowseCard from "$lib/components/BrowseCard.svelte";
  import MetaData from "$lib/components/MetaData.svelte";
  import Pagination from "$lib/components/UI/Pagination.svelte";

  import {
    currentPage,
    pageSize,
    searchTerm,
    secondSearchTerm,
  } from "$lib/stores";
  import AppWrap from "$lib/components/AppWrap.svelte";
  import SearchBar from "$lib/components/SearchBar.svelte";
  import PerPage from "$lib/components/UI/PerPage.svelte";
  import Search from "$lib/components/UI/Search.svelte";
  import CardHolder from "$lib/components/CardHolder.svelte";
  import { fade } from "svelte/transition";
  import { ChevronDown } from "lucide-svelte";

  export let data: PageServerData;

  const urlParams = derived(
    [currentPage, pageSize],
    ([$currentPage, $pageSize]) => {
      return `/browse?q=${$searchTerm}&p=${$currentPage}&s=${$pageSize}`;
    },
  );

  let searchInput: HTMLInputElement;

  onMount(() => {
    currentPage.set(parseInt(data.urlParams.page));
    pageSize.set(parseInt(data.urlParams.pageSize));
    searchTerm.set(data.urlParams.search);
    secondSearchTerm.set(data.urlParams.search);

    const unsubscribe = urlParams.subscribe(async (url) => {
      await goto(url);
    });
    return () => {
      unsubscribe();
    };
  });

  async function handleChangePage(increment: number) {
    if (document.activeElement === searchInput) {
      return;
    }

    const newPage = await changePage(
      increment,
      data.ingredients.total_pages,
      $currentPage,
    );
    currentPage.set(newPage);
  }

  let dimmed = false;
  let showNames = true;
  let showDescriptors = true;
  let showCas = true;
  let totalResults =
    data.ingredients.cas.length +
    data.ingredients.descriptors.length +
    data.ingredients.names.length;
  $: totalResults =
    data.ingredients.cas.length +
    data.ingredients.descriptors.length +
    data.ingredients.names.length;

  const description = "Browse perfume compounds. IFRA FIG. 3100 ingredients.";
  const ogTitle = "BCF | Browse";
  const ogUrl = "https://bcfapp.app/browse";
</script>

<MetaData title={ogTitle} {description} {ogTitle} {ogUrl} />

<AppWrap class="text-center md:text-left">
  {#if $searchTerm === "" || data.ingredients.count === 3100}
    <h2 class="font-quicksand my-4 text-3xl font-bold" in:fade>
      Showing all ingredients
    </h2>
  {:else}
    <h2 class="font-quicksand my-4 text-3xl font-bold" in:fade>
      Showing {totalResults}
      {totalResults === 1 ? "result" : "results"} for "{$searchTerm}"
    </h2>
  {/if}
  <SearchBar>
    <Search value={searchTerm} bind:searchInput />

    <PerPage />
    <Pagination
      on:nextPage={() => handleChangePage(1)}
      on:prevPage={() => handleChangePage(-1)}
    />
  </SearchBar>

  <div
    id="table-wrapper"
    class:dimmed
    class="my-8 flex w-full flex-col transition-all"
  >
    {#if data.ingredients.names.length === 0 && data.ingredients.descriptors.length === 0 && data.ingredients.cas.length === 0}
      <p class="font-quicksand m-12 text-5xl font-bold">
        Hm. Try a different search?
      </p>
    {:else}
      {#if $searchTerm === ""}
        <CardHolder>
          {#each data.ingredients.names as ingredient}
            <BrowseCard {ingredient} />
          {/each}
        </CardHolder>
      {/if}

      {#if data.ingredients.names.length !== 0}
        <div class="flex items-center space-x-2">
          <h3 class="font-quicksand my-2 text-2xl">Found in Names</h3>
          <button on:click={() => (showNames = !showNames)} class:showNames>
            <ChevronDown class="size-8"></ChevronDown>
          </button>
        </div>
        {#if showNames}
          <CardHolder>
            {#each data.ingredients.names as ingredient}
              <BrowseCard {ingredient} />
            {/each}
          </CardHolder>
        {/if}
      {/if}

      {#if data.ingredients.descriptors.length !== 0}
        <div class="flex items-center space-x-2">
          <h3 class="font-quicksand my-2 text-2xl">Found in Descriptors</h3>
          <button
            on:click={() => (showDescriptors = !showDescriptors)}
            class:showDescriptors
          >
            <ChevronDown class="size-8"></ChevronDown>
          </button>
        </div>
        {#if showDescriptors}
          <CardHolder>
            {#each data.ingredients.descriptors as ingredient}
              <BrowseCard {ingredient} />
            {/each}
          </CardHolder>
        {/if}
      {/if}

      {#if data.ingredients.cas.length !== 0}
        <div class="flex items-center space-x-2">
          <h3 class="font-quicksand my-2 text-2xl">Found in CAS</h3>
          <button on:click={() => (showCas = !showCas)} class:showCas>
            <ChevronDown class="size-8"></ChevronDown>
          </button>
        </div>
        {#if showCas}
          <CardHolder>
            {#each data.ingredients.cas as ingredient}
              <BrowseCard {ingredient} />
            {/each}
          </CardHolder>
        {/if}
      {/if}
    {/if}
  </div>
</AppWrap>

<style lang="postcss">
  .dimmed {
    filter: blur(1px);
    opacity: 80%;
  }

  .showNames {
    @apply rotate-180;
  }

  .showDescriptors {
    @apply rotate-180;
  }

  .showCas {
    @apply rotate-180;
  }
</style>
