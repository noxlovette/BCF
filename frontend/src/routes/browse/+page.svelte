<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { derived } from "svelte/store";
  import type { PageServerData } from "./$types";
  import { changePage, handleKeydown } from "$lib/utils";
  import BrowseCard from "$lib/components/BrowseCard.svelte";
  import MetaData from "$lib/components/MetaData.svelte";
  import Pagination from "$lib/components/UI/Pagination.svelte";
  import ResetButton from "$lib/components/UI/ResetButton.svelte";

  import {
    currentPage,
    pageSize,
    searchTerm,
    notification,
    secondSearchTerm,
  } from "$lib/stores";
  import AppWrap from "$lib/components/AppWrap.svelte";
  import SearchBar from "$lib/components/SearchBar.svelte";
  import PerPage from "$lib/components/UI/PerPage.svelte";
  import Search from "$lib/components/UI/Search.svelte";
    import CardHolder from "$lib/components/CardHolder.svelte";
    import { fade } from "svelte/transition";

  export let data: PageServerData;
  const urlParams = derived(
    [currentPage, pageSize],
    ([$currentPage, $pageSize]) => {
      return `/browse?page=${$currentPage}&search=${$searchTerm}&page_size=${$pageSize}`;
    },
  );

  let searchInput: HTMLInputElement;


  onMount(() => {
    currentPage.set(parseInt(data.urlParams.page));
    pageSize.set(parseInt(data.urlParams.pageSize));
    searchTerm.set(data.urlParams.search);

    const unsubscribe = urlParams.subscribe(async (url) => {
      await goto(url);
    });
    return () => {
      unsubscribe();
    };
  });

  

  function reset() {
    searchTerm.set("");
  }

  async function searchIngredients() {
    currentPage.set(1);
    dimmed = false;
    searchTerm.set($secondSearchTerm);
    if ($searchTerm === "") {
      notification.set({ message: "Showing all ingredients", type: "info" });
    } else {
      await goto(`/browse?page=1&search=${$searchTerm}&page_size=${$pageSize}`);
      notification.set({
        message: `Searching for ${$searchTerm}...`,
        type: "info",
      });
    }
  }

  async function handleChangePage(increment: number) {
    const newPage = await changePage(
      increment,
      data.ingredients.total_pages,
      $currentPage,
    );
    currentPage.set(newPage);
  }


  let foundInCommonName: App.IngredientBrowse[] = [];
  let foundinOtherNames:App.IngredientBrowse[] = [];
  let foundInCas: App.IngredientBrowse[] = [];
  let foundInDescriptors: App.IngredientBrowse[] = [];

  $:foundInCommonName = data.ingredients.results.filter(ingredient => {
    return ingredient.common_name?.toLowerCase().includes($searchTerm.toLowerCase());
});

$:foundinOtherNames = data.ingredients.results.filter(ingredient => {
    return ingredient.other_names?.toLowerCase().includes($searchTerm.toLowerCase());
});

$:foundInCas = data.ingredients.results.filter(ingredient => {
    return ingredient.cas?.toLowerCase().includes($searchTerm.toLowerCase());
});

$:foundInDescriptors = data.ingredients.results.filter(ingredient => {
    return ingredient.descriptors?.toLowerCase().includes($searchTerm.toLowerCase());
});

let dimmed = false;

  const description = "Browse perfume compounds. IFRA FIG.";
  const ogTitle = "BCF | Browse";
  const ogUrl = "https://bcfapp.app/browse";
  const imageUrl = "https://bcfapp.app/assets/img/dalle-browse-4.webp";
</script>

<MetaData title={ogTitle} {description} {ogTitle} {ogUrl} ogImage={imageUrl} />
<svelte:window
  class="dark:text-stone-100"
  on:keydown={handleKeydown(searchInput, handleChangePage, $searchTerm)}
/>

<AppWrap>
  {#if $searchTerm === "" || data.ingredients.count === 3100}
    <h2 class="text-3xl font-bold font-quicksand my-4"
    in:fade
    >Showing all ingredients</h2>
  {:else}
    <h2 class="text-3xl font-bold font-quicksand my-4"
    in:fade
    
    >Showing {data.ingredients.count} results for "{$searchTerm}"</h2>
  {/if}
  <SearchBar>
      <Search
        value={secondSearchTerm}
        on:input={(event) => event.key === "Enter" && searchIngredients()}
        bind:searchInput
        on:focus={()=>dimmed=true}
        on:blur={searchIngredients}
      />
    <PerPage />
    <ResetButton on:reset={reset} />
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
    {#if data.ingredients.results.length === 0}
      <p class="m-12 text-5xl font-bold font-quicksand">Hm. Try a different search?</p>
    {:else}

    {#if $searchTerm === ""}
      <CardHolder>
        {#each data.ingredients.results as ingredient}
          <BrowseCard {ingredient} />
        {/each}
      </CardHolder>
    {:else}
    {#if foundInCommonName.length !== 0 || foundinOtherNames.length !== 0}
    <h3 class="text-2xl font-medium font-quicksand my-2">Found in Names</h3>
    <CardHolder>
      {#each foundInCommonName as ingredient}
      {#if ingredient}
        <BrowseCard {ingredient} />            
      {/if}
    {/each}
    {#each foundinOtherNames as ingredient}
      {#if ingredient}
        <BrowseCard {ingredient} />            
      {/if}
    {/each}
    </CardHolder>
    {/if}

    
    {#if foundInDescriptors.length !== 0}
    
    <h3 class="text-2xl font-medium font-quicksand my-2">Found in Descriptors</h3>
    <CardHolder>
      {#each foundInDescriptors as ingredient}
      {#if ingredient}
      <BrowseCard {ingredient} />            
      {/if}
      {/each}
    </CardHolder>
    
    {#if foundInCas.length !== 0}
    <h3 class="text-2xl font-medium font-quicksand my-2">Found in CAS</h3>
    <CardHolder>
      {#each foundInCas as ingredient}
      {#if ingredient}
        <BrowseCard {ingredient} />            
      {/if}
    {/each}
    </CardHolder>
    {/if}
    {/if}    
    {/if}
    {/if}
  </div>
</AppWrap>

<style>
  .dimmed {
    filter: blur(1px);
    opacity: 80%;
  }
</style>
