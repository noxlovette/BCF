<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { derived } from "svelte/store";
  import DescriptorToggle from "$lib/components/UI/DescriptorToggle.svelte";
  import type { PageServerData } from "./$types";
  import { changePage, handleKeydown } from "$lib/utils";
  import BrowseCard from "$lib/components/BrowseCard.svelte";
  import MetaData from "$lib/components/MetaData.svelte";
  import Pagination from "$lib/components/UI/Pagination.svelte";
  import ResetButton from "$lib/components/UI/ResetButton.svelte";

  import { currentPage, pageSize, searchTerm, notification, secondSearchTerm } from "$lib/stores";
  import AppWrap from "$lib/components/AppWrap.svelte";
  import SearchBar from "$lib/components/SearchBar.svelte";
  import PerPage from "$lib/components/UI/PerPage.svelte";
  import Search from "$lib/components/UI/Search.svelte";


  export let data: PageServerData;
  const urlParams = derived(
    [currentPage, pageSize],
    ([$currentPage, $pageSize]) => {
      return `/browse?page=${$currentPage}&search=${$searchTerm}&page_size=${$pageSize}`;
    },
  );

  let chosenDescriptors = [];
  let filteredDescriptors = [];
  let showFilterMenu = false;
  let searchInput;
  let searchInputDescriptor;
  let filterMenu;

  $: {
    searchDescriptors($secondSearchTerm);
  }

  onMount(() => {
    filteredDescriptors = data.descriptors;

    const unsubscribe = urlParams.subscribe(async (url) => {
      await goto(url);
    });
    return () => {
      unsubscribe();
    };
  });

  function searchDescriptors(term: string) {
    filteredDescriptors = data.descriptors.filter((descriptor) =>
      descriptor.name.toLowerCase().includes(term.toLowerCase())
    );
  }

  function reset() {
    chosenDescriptors = [];
    searchTerm.set("");
  }

  async function searchIngredients() {
    currentPage.set(1);
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

  function toggleFilterMenu() {
    showFilterMenu = !showFilterMenu;
  }

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
  <SearchBar>
    <DescriptorToggle {showFilterMenu} on:toggleFilterMenu={toggleFilterMenu} />

    {#if showFilterMenu}
    <Search value={secondSearchTerm} on:input={()=>searchDescriptors} bind:searchInput={searchInputDescriptor} on:blur={()=>searchDescriptors} placeholder="/ search descriptors..." />
{:else}
    <Search value={searchTerm} on:input={(event) => event.key === "Enter" && searchIngredients()} bind:searchInput on:blur={searchIngredients} />
{/if}
    <ResetButton on:reset={reset} />

    <PerPage />

    <Pagination
      on:nextPage={() => handleChangePage(1)}
      on:prevPage={() => handleChangePage(-1)}
    />
  </SearchBar>

  <div
    id="table-wrapper"
    class="my-8 flex w-full flex-col items-center justify-center"
  >
    {#if data.ingredients.results.length === 0}
      <!-- If there are no results, display a message -->
      <p class="m-12 text-5xl">Hm. Try a different search?</p>
    {:else}
      <div
        id="filter"
        class="grid w-full items-center gap-4 mb-12 py-4 border-b-2 border-gold-400 bg-white/20 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 dark:bg-stone-900/20"
        class:hidden={!showFilterMenu}
        bind:this={filterMenu}
      >
        {#if filteredDescriptors.length !== 0 && filteredDescriptors}
          {#each filteredDescriptors as descriptor}
            <div class="flex md:flex-col xl:flex-row">
              <label
                class="md:text-md sm:text-sm lg:text-base"
                title={descriptor.description}
              >
                <input
                  class="mx-2
            size-4 rounded-full border-none text-navy-600/90 shadow transition-all checked:bg-navy-700/70 checked:ring-navy-700/30 hover:scale-110 hover:checked:bg-navy-600/80 focus:ring-navy-400/30"
                  type="checkbox"
                  id={descriptor.name}
                  bind:group={chosenDescriptors}
                  value={descriptor}
                />
                {descriptor.name}
              </label>
            </div>
          {/each}
        {:else}
          <p>No descriptors found</p>
        {/if}
      </div>

      <div
        id="card-holder"
        class="grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
        {#each data.ingredients.results as ingredient}
          {#if ingredient}
            <BrowseCard {ingredient} />
          {/if}
        {/each}
      </div>
    {/if}
  </div>
</AppWrap>