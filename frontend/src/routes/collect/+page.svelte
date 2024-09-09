<script lang="ts">
  import { onMount } from "svelte";
  import { goto, invalidateAll } from "$app/navigation";
  import CreateButton from "$lib/components/UI/CreateButton.svelte";
  import { changePage } from "$lib/utils";
  import CollectCard from "$lib/components/CollectCard.svelte";
  import MetaData from "$lib/components/MetaData.svelte";
  import PerPage from "$lib/components/UI/PerPage.svelte";

  import ResetButton from "$lib/components/UI/ResetButton.svelte";
  import { handleKeydown } from "$lib/utils";
  import { currentPage, pageSize, searchTerm } from "$lib/stores";
  import type { PageData } from "../$types";
  import Pagination from "$lib/components/UI/Pagination.svelte";
    import AppWrap from "$lib/components/AppWrap.svelte";
    import SearchBar from "$lib/components/SearchBar.svelte";
    import Search from "$lib/components/UI/Search.svelte";

  export let data: PageData;
  let collection = data.collection;
  let searchInput: HTMLInputElement | null = null;
  let filteredCollection: any[] = [];
  let paginatedCollection: any[] = [];
  let totalPages: number = 0;

  $: totalItems = filteredCollection.length;
  $: totalPages = Math.ceil(totalItems / $pageSize);
  $: startIndex = ($currentPage - 1) * $pageSize;
  $: endIndex = Math.min(startIndex + $pageSize, totalItems);
  $: paginatedCollection = filteredCollection.slice(startIndex, endIndex);

  onMount(() => {
    filteredCollection = collection;
    updatePagination();
  });

  function updatePagination() {
    const urlParams = new URLSearchParams(window.location.search);
    const pageFromUrl = parseInt(urlParams.get("page") || "1");
    const searchFromUrl = urlParams.get("search") || "";
    const pageSizeFromUrl = parseInt(urlParams.get("page_size") || "24");

    currentPage.set(pageFromUrl);
    searchTerm.set(searchFromUrl);
    pageSize.set(pageSizeFromUrl);

    handleSearchCollection();
  }

  async function reset() {
    await invalidateAll();
    filteredCollection = collection;
    updateUrl();
  }

  async function updatePageSize() {
    currentPage.set(1);
    updateUrl();
  }

  async function handleChangePage(increment: number) {
    const newPage = await changePage(increment, totalPages, $currentPage);
    currentPage.set(newPage);
    updateUrl();
  }

  function handleSearchCollection() {
    filteredCollection = collection.filter((ingredient) => {
      const commonName = ingredient.common_name || "";
      const cas = ingredient.cas || "";
      return (
        commonName.toLowerCase().includes($searchTerm.toLowerCase()) ||
        cas.toLowerCase().includes($searchTerm.toLowerCase())
      );
    });
    currentPage.set(1);
    updateUrl();
  }

  function updateUrl() {
    const url = `/collect?page=${$currentPage}&search=${$searchTerm}&page_size=${$pageSize}`;
    goto(url, { replaceState: true });
  }
</script>

<MetaData
  title="BCF | Collect"
  ogTitle="BCF | Collect"
  description="Collect perfume ingredients. Leave comments, manage your laboratory."
  ogUrl="https://bcfapp.app/collect"
/>
<svelte:window
  on:keydown={handleKeydown(searchInput, handleChangePage, $searchTerm)}
/>

<AppWrap>
  <SearchBar>
    
    <Search on:search={handleSearchCollection} bind:searchInput />
    
    <PerPage on:updatePageSize={updatePageSize} />
    <CreateButton href="/collect/create" />
    <ResetButton on:reset={reset} />


    <Pagination
      on:nextPage={() => handleChangePage(1)}
      on:prevPage={() => handleChangePage(-1)}
    />
  </SearchBar>

  <div id="table-wrapper" class="my-8 flex w-full items-center justify-center">
    {#if paginatedCollection.length === 0}
      <p class="m-12 text-5xl">Hm. Try a different search?</p>
    {:else}
      <div
        id="card-holder"
        class="grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
        {#each paginatedCollection as ingredient}
          {#if ingredient}
            <CollectCard {ingredient} />
          {/if}
        {/each}
      </div>
    {/if}
  </div>

  <div class="mt-4 flex items-center justify-between">
    <p>Showing {startIndex + 1} to {endIndex} of {totalItems} items</p>
  </div>
</AppWrap>
