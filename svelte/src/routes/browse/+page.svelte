<script lang="ts">
  import BrowseCard from "$lib/components/BrowseCard.svelte";
  import MetaData from "$lib/components/MetaData.svelte";
  import AppWrap from "$lib/components/AppWrap.svelte";
  import SearchBar from "$lib/components/SearchBar.svelte";
  import PerPage from "$lib/components/UI/PerPage.svelte";
  import Search from "$lib/components/UI/Search.svelte";
  import CardHolder from "$lib/components/CardHolder.svelte";
  import { fade } from "svelte/transition";
  import { searchTerm } from "$lib/stores";
  import { page } from "$app/state";

  let { data } = $props();

  let totalResults = data.ingredients.length;

  let pageSize = $derived(
    Number(page.url.searchParams.get("page_size") || "10"),
  );
  let currentPage = $derived(Number(page.url.searchParams.get("page") || "1"));

  let searchInput: HTMLInputElement = $state();
  const description = "Browse perfume compounds. IFRA FIG. 3100 ingredients.";
  const ogTitle = "BCF | Browse";
  const ogUrl = "https://bcfapp.app/browse";
</script>

<MetaData title={ogTitle} {description} {ogTitle} {ogUrl} />

<AppWrap class="text-center md:text-left">
  {#if $searchTerm === ""}
    <h2 class="font-quicksand my-4 text-3xl font-bold" in:fade>
      Showing {totalResults} ingredients
    </h2>

    <SearchBar>
      <Search value={searchTerm} bind:searchInput />

      <PerPage />
      Pagination
      <a href="/browse?page={currentPage + 1}&page_size={pageSize}">
        FORWARD
      </a>
    </SearchBar>

    <div id="table-wrapper" class="my-8 flex w-full flex-col transition-all">
      {#if data.ingredients.length === 0}
        <p class="font-quicksand m-12 text-5xl font-bold">
          Hm. Try a different search?
        </p>
      {:else}
        <CardHolder>
          {#each data.ingredients as ingredient}
            <BrowseCard {ingredient} />
          {/each}
        </CardHolder>
      {/if}
    </div>
  {/if}
</AppWrap>
