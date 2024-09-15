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
  import type { PageServerData } from "../$types";
  import Pagination from "$lib/components/UI/Pagination.svelte";
  import AppWrap from "$lib/components/AppWrap.svelte";
  import SearchBar from "$lib/components/SearchBar.svelte";
  import Search from "$lib/components/UI/Search.svelte";
  import { notification } from "$lib/stores";
  import { enhance } from "$app/forms";
  import { fade } from "svelte/transition";
    import CardHolder from "$lib/components/CardHolder.svelte";

  export let data: PageServerData;
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
    const pageFromUrl = parseInt(urlParams.get("p") || "1");
    const searchFromUrl = urlParams.get("q") || "";
    const pageSizeFromUrl = parseInt(urlParams.get("s") || "50");

    currentPage.set(pageFromUrl);
    searchTerm.set(searchFromUrl);
    pageSize.set(pageSizeFromUrl);
  }

  async function updatePageSize() {
    currentPage.set(1);
  }

  async function handleChangePage(increment: number) {
    const newPage = await changePage(increment, totalPages, $currentPage);
    currentPage.set(newPage);
  }

    $: filteredCollection = collection.filter((ingredient) => {
      const commonName = ingredient.common_name || "";
      const cas = ingredient.cas || "";
      return (
        commonName.toLowerCase().includes($searchTerm.toLowerCase()) ||
        cas.toLowerCase().includes($searchTerm.toLowerCase())
      );
    });
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

<AppWrap class="text-center md:text-left">
  {#if $searchTerm === ""}
    <h2 class="my-4 font-quicksand text-3xl font-bold" in:fade>
      Showing all ingredients
    </h2>
  {:else}
    <h2 class="my-4 font-quicksand text-3xl font-bold" in:fade>
      Showing {totalItems} results for "{$searchTerm}"
    </h2>
  {/if}
  <SearchBar>
    <Search bind:searchInput />

    <PerPage on:updatePageSize={updatePageSize} />
    <form
      method="post"
      action="?/create"
      use:enhance={() =>
        notification.set({
          message: "New Ingredient Created",
          type: "success",
        })}
    >
      <CreateButton on:create />
    </form>

    <form method="post" action="?/reset" use:enhance>
      <ResetButton />
    </form>

    <Pagination
      on:nextPage={() => handleChangePage(1)}
      on:prevPage={() => handleChangePage(-1)}
    />
  </SearchBar>

  <div id="table-wrapper" class="my-8 flex w-full items-center justify-center">
    {#if paginatedCollection.length === 0}
      <p class="m-12 text-5xl">Hm. Try a different search?</p>
    {:else}
      <CardHolder>
        {#each paginatedCollection as ingredient}
            <CollectCard {ingredient} />
        {/each}
      </CardHolder>

    {/if}
  </div>

  <div class="mt-4 flex items-center justify-between">
    <p>Showing {startIndex + 1} to {endIndex} of {totalItems} items</p>
  </div>
</AppWrap>
