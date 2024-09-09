<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { tick } from "svelte";
  import { derived, writable } from "svelte/store";
  import DescriptorToggle from "$lib/components/UI/DescriptorToggle.svelte";
  import type { PageServerData } from "./$types";
  import { changePage, handleKeydown } from "$lib/utils";
  import BrowseCard from "$lib/components/BrowseCard.svelte";
  import { notification } from "$lib/stores/notificationStore";
  import MetaData from "$lib/components/MetaData.svelte";
  import Pagination from "$lib/components/UI/Pagination.svelte";
  import ResetButton from "$lib/components/UI/ResetButton.svelte";

  export let data: PageServerData;
  export let currentPage = writable(1);
  export let pageSize = writable(24);
  export let searchTerm = writable("");
  const urlParams = derived(
    [currentPage, pageSize],
    ([$currentPage, $pageSize]) => {
      return `/browse?page=${$currentPage}&search=${$searchTerm}&page_size=${$pageSize}`;
    },
  );

  let chosenDescriptors = [];
  let showFilterMenu = false;
  let searchInput;
  let showTuneMenu = false;
  let isLoading = true;
  let searchTermDescriptor = "";
  let filteredDescriptors = [];
  let sortedDescriptors = [];

  onMount(() => {
    filteredDescriptors = data.descriptors;
    searchDescriptors();
    const unsubscribe = urlParams.subscribe(async (url) => {
      await goto(url);
    });
    return () => {
      unsubscribe();
    };
  });

  const searchDescriptors = () => {
    if (searchTermDescriptor.trim() === "") {
      filteredDescriptors = data.descriptors;
    } else {
      // Filter descriptors based on search term
      filteredDescriptors = data.descriptors.filter((descriptor) =>
        descriptor.name
          .toLowerCase()
          .includes(searchTermDescriptor.toLowerCase()),
      );
    }

    sortedDescriptors = filteredDescriptors.sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    if (chosenDescriptors.length > 0) {
      const descriptorNames = chosenDescriptors.map(
        (descriptor) => descriptor.name,
      );
      notification.set({ message: descriptorNames.join(", "), type: "info" });
    }
  };

  let filterMenu;
  let searchInputDescriptor;

  function handleClickOutside(event) {
    if (
      filterMenu &&
      !filterMenu.contains(event.target) &&
      !searchInputDescriptor.contains(event.target)
    ) {
      document.removeEventListener("click", handleClickOutside);
      showFilterMenu = false;
    }
  }

  function reset() {
    chosenDescriptors = [];
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

  async function toggleFilterMenu() {
    showFilterMenu = !showFilterMenu;
    await tick();
    if (showFilterMenu) {
      setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 100);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    showTuneMenu = false;
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

<div
  id="app"
  class="flex w-full flex-col items-center lowercase caret-navy-700"
>
  <form
    id="search-bar"
    class="group flex w-full flex-col items-center justify-between space-x-0 space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
  >
    <DescriptorToggle {showFilterMenu} on:toggleFilterMenu={toggleFilterMenu} />

    <input
      type="text"
      class="w-full rounded-lg border-none bg-white shadow transition-all hover:shadow-lg focus:scale-95 focus:ring-2 focus:ring-navy-400/70 active:scale-90 lg:w-[600px] dark:bg-stone-800"
      bind:value={searchTermDescriptor}
      class:hidden={!showFilterMenu}
      bind:this={searchInputDescriptor}
      on:input={searchDescriptors}
      placeholder="/ search descriptors..."
      title="find the descriptor that you are looking for"
    />

    <input
      type="text"
      class="w-full rounded-lg border-none bg-white shadow transition-all hover:shadow-lg focus:scale-95 focus:ring-2 focus:ring-navy-700/60 active:scale-90 lg:w-[600px] dark:bg-stone-800"
      bind:value={$searchTerm}
      class:hidden={showFilterMenu}
      bind:this={searchInput}
      on:input={(event) => event.key === "Enter" && searchIngredients()}
      on:blur={searchIngredients}
      placeholder="/ search ingredients..."
      title="find an ingredient by CAS or the multiple names that it might have"
    />

    <ResetButton on:reset={reset} />

    <label
      class="md:text-md group mr-auto hidden opacity-60 transition-opacity hover:opacity-100 sm:text-sm lg:block"
    >
      per page:
      <input
        type="number"
        class="w-1/3 rounded-lg border-none focus:ring-2 focus:ring-navy-400/70 group-hover:shadow dark:bg-stone-800"
        min="1"
        bind:value={$pageSize}
      />
    </label>
    <Pagination
      on:nextPage={() => handleChangePage(1)}
      on:prevPage={() => handleChangePage(-1)}
    />
  </form>

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
        class="grid w-full items-center gap-4 rounded-lg border-none bg-white/20 p-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 dark:bg-stone-900/20"
        class:hidden={!showFilterMenu}
        bind:this={filterMenu}
      >
        {#if filteredDescriptors.length !== 0 && filteredDescriptors}
          {#each sortedDescriptors as descriptor}
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
          <p>no descriptors found</p>
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
</div>
