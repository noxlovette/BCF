<script lang="ts">
  import BrowseCard from "$lib/components/BrowseCard.svelte";
  import MetaData from "$lib/components/MetaData.svelte";
  import SearchBar from "$lib/components/SearchBar.svelte";
  import PerPage from "$lib/components/UI/PerPage.svelte";
  import Search from "$lib/components/UI/Search.svelte";
  import CardHolder from "$lib/components/CardHolder.svelte";
  import { searchTerm, pageSize, currentPage, notification } from "$lib/stores";
  import { page } from "$app/state";
  import Pagination from "$lib/components/UI/Pagination.svelte";
  import { goto } from "$app/navigation";

  let { data } = $props();

  searchTerm.set(page.url.searchParams.get("search"));
  pageSize.set(Number(page.url.searchParams.get("page_size")));
  currentPage.set(Number(page.url.searchParams.get("page")));

  $effect(() => {
    goto(
      `/browse?search=${$searchTerm}&page_size=${$pageSize}&page=${$currentPage}`,
      { noScroll: true, keepFocus: true },
    );

    notification.set({ message: `Current Page ${$currentPage}`, type: "info" });
  });

  $inspect($currentPage);

  const description = "Browse perfume compounds. IFRA FIG. 3100 ingredients.";
  const ogTitle = "BCF | Browse";
  const ogUrl = "https://bcfapp.app/browse";
</script>

<MetaData title={ogTitle} {description} {ogTitle} {ogUrl} />

<SearchBar>
  <Search />
  <PerPage />
  <Pagination />
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
