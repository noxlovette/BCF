<script lang="ts">
  import { onMount } from "svelte";
  import { goto, invalidateAll } from "$app/navigation";
  import CreateButton from "$lib/components/UI/CreateButton.svelte";
  import { changePage } from "$lib/utils";
  import CollectCard from "$lib/components/CollectCard.svelte";
  import MetaData from "$lib/components/MetaData.svelte";

  import ResetButton from "$lib/components/UI/ResetButton.svelte";
  import { handleKeydown } from "$lib/utils";
  import { currentPage, pageSize, searchTerm } from "$lib/stores";
  import type { PageData } from "../$types";
  import Pagination from "$lib/components/UI/Pagination.svelte";

  export let data: PageData;
  let collection = data.collection;
  let searchInput: HTMLInputElement | null = null;
  let filteredCollection: any[] = [];
  let paginatedCollection: any[] = [];
  let chosenIngredient: any = null;
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
    const pageSizeFromUrl = parseInt(urlParams.get("page_size") || "10");

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

<div id="app" class="flex w-full flex-col lowercase caret-grapefruit-700">
  <form
    id="search-bar"
    class="group flex w-full flex-col items-center justify-between space-x-0 space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
  >
    <CreateButton href="/collect/create" />

    <input
      type="text"
      class="w-full rounded-lg border-none bg-white shadow transition-all hover:shadow-lg focus:scale-95 focus:ring-2 focus:ring-grapefruit-700/60 active:scale-90 md:w-1/2 dark:bg-stone-800"
      bind:value={$searchTerm}
      bind:this={searchInput}
      on:change={handleSearchCollection}
      placeholder="/ search ingredients..."
      title="find an ingredient by CAS or the multiple names that it might have"
    />

    <ResetButton on:reset={reset} />

    <label
      class="md:text-md group mr-auto hidden items-center opacity-60 transition-opacity hover:opacity-100 sm:text-sm lg:block"
    >
      per page:
      <input
        type="number"
        class="w-1/3 rounded-lg border-none focus:ring-2 focus:ring-grapefruit-400/70 group-hover:shadow dark:bg-stone-800"
        min="1"
        bind:value={$pageSize}
        on:change={updatePageSize}
      />
    </label>

    <Pagination
      on:nextPage={() => handleChangePage(1)}
      on:prevPage={() => handleChangePage(-1)}
    />
  </form>

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
</div>
