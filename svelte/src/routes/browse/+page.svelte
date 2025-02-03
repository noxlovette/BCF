<script lang="ts">
  import {
    BrowseCard,
    MetaData,
    Search,
    SearchBar,
    CardHolder,
    PerPage,
    Pagination,
  } from "$lib/components";
  import { searchTerm, pageSize, currentPage, notification } from "$lib/stores";
  import { goto } from "$app/navigation";

  let { data } = $props();

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
    <p class="font-quicksand m-12 text-5xl font-bold">Looks Lonely Here</p>
  {:else}
    <CardHolder>
      {#each data.ingredients as ingredient}
        <BrowseCard {ingredient} />
      {/each}
    </CardHolder>
  {/if}
</div>
