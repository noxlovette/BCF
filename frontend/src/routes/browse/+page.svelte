<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { tick } from "svelte";
  import { derived, writable } from "svelte/store";
  import { blur, fade } from "svelte/transition";

  import type { PageServerData } from "./$types";

  import {handleKeydown} from "$lib/utils";

  import Loader from "$lib/components/Loader.svelte";
  import BrowseCard from "$lib/components/BrowseCard.svelte";
  import { notification } from "$lib/stores/notificationStore";
  import ArrowLeftIcon from "$lib/icons/ArrowLeftIcon.svelte";
  import ArrowRightIcon from "$lib/icons/ArrowRightIcon.svelte";
  import ResetIcon from "$lib/icons/ResetIcon.svelte";
    import MetaData from "$lib/components/MetaData.svelte";

  export let data: PageServerData;
  export let currentPage = writable(1);
  export let pageSize = writable(24);
  export let searchTerm = writable("");
  const urlParams = derived([currentPage, pageSize], ([$currentPage, $pageSize]) => {
  return `/browse?page=${$currentPage}&search=${$searchTerm}&page_size=${$pageSize}`;
});


  let chosenDescriptors = [];
  let showFilterMenu = false;
  let searchInput;
  let showTuneMenu = false;
  let isLoading = true;
  let searchTermDescriptor = "";
  let filteredDescriptors = [];
  let sortedDescriptors = [];

  onMount(() => {
  currentPage.set(parseInt(sessionStorage.getItem("currentPage")) || 1);
  pageSize.set(parseInt(localStorage.getItem("pageSize")) || 24);
  searchTerm.set(sessionStorage.getItem("searchTerm") || "");

  isLoading = false;

  filteredDescriptors = data.descriptors;
  searchDescriptors();

  currentPage.subscribe((value) => sessionStorage.setItem("currentPage", String(value)));
  pageSize.subscribe((value) => localStorage.setItem("pageSize", String(value)));
  searchTerm.subscribe((value) => sessionStorage.setItem("searchTerm", String(value)));

  const unsubscribe = urlParams.subscribe(async (url) => {
    if (isLoading) return; // Avoid navigation during initial load
    await goto(url); // Navigate only when URL changes
  });

  return () => {
    unsubscribe();
  };
});

const searchDescriptors = () => {
  // If search field is empty, reset to show all descriptors
  if (searchTermDescriptor.trim() === "") {
    filteredDescriptors = data.descriptors;
  } else {
    // Filter descriptors based on search term
    filteredDescriptors = data.descriptors.filter((descriptor) =>
      descriptor.name.toLowerCase().includes(searchTermDescriptor.toLowerCase())
    );
  }

  // Sort filtered descriptors by name
  sortedDescriptors = filteredDescriptors.sort((a, b) => a.name.localeCompare(b.name));

  // Handle notification for chosen descriptors
  if (chosenDescriptors.length > 0) {
    const descriptorNames = chosenDescriptors.map((descriptor) => descriptor.name);
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

  async function reset() {
    searchTerm.set("");
    currentPage.set(1);
    chosenDescriptors = [];
    notification.set({ message: "resetting everything...", type: "info" });
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

  async function changePage(increment: number) {
  try {
    if (document.activeElement === searchInput) {
      await searchIngredients();
      return;
    }

    const newPage:number = $currentPage + increment;

    if (data.ingredients && (newPage < 1 || newPage > data.ingredients.total_pages)) {
      notification.set({
        message: `There is nothing to seek there`,
        type: "error",
      });
      return;
    }

    currentPage.update((value: number) => value + increment);
    
    try {  
      if (data.ingredients === null) {
        throw new Error("Failed to load data");
      }
      
      const message = `You are on page ${newPage}/${data.ingredients.total_pages}`;
      notification.set({ message: message, type: "info" });
    } catch (error) {
      console.error("Navigation or data loading error:", error);
      notification.set({
        message: "Failed to load the next page. Please try again.",
        type: "error",
      });
      currentPage.update((value) => value - increment);
    }
  } catch (error) {
    console.error("An error occurred:", error);
    notification.set({
      message: "An unexpected error occurred. Please try again.",
      type: "error",
    });
  }
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

<MetaData title={ogTitle} description={description} ogTitle={ogTitle} ogUrl={ogUrl} ogImage={imageUrl} />
<svelte:window class="dark:text-stone-100" on:keydown={handleKeydown(searchInput, toggleOverlay, changePage, $searchTerm)} />


<div id="app" class="flex flex-col items-center lowercase caret-navy-700">
  <form
    id="search-bar"
    class="group flex w-full flex-col items-center justify-between space-x-0 space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
  >

    <button
      on:mousedown={toggleFilterMenu}
      title="filter by descriptors"
      class="rounded-lg hidden md:flex border border-navy-700 bg-navy-700 p-2 text-center text-navy-50 shadow transition-all hover:bg-white hover:text-navy-700 hover:shadow-lg active:shadow-none dark:hover:bg-stone-800 dark:hover:text-stone-50"
    >
      {#if showFilterMenu}
        ingredients
      {:else}
        descriptors
      {/if}
    </button>

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

    <button
      on:mousedown={reset}
      title="reset everything"
      class="rounded-full border border-navy-700 bg-navy-700 p-2 text-navy-50 shadow hover:bg-white hover:text-navy-700 hover:shadow-lg active:shadow-none dark:hover:bg-stone-800 dark:hover:text-stone-50"
    >
      <ResetIcon />
    </button>



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



    <div
      id="pagination"
      class="flex w-[100px] items-center justify-center rounded-full border border-navy-700 bg-navy-700 p-2 text-navy-50 shadow hover:bg-white hover:text-navy-700 active:shadow-none dark:hover:bg-stone-800 dark:hover:text-stone-50 {showFilterMenu ||
      ($currentPage <= 1 && $currentPage >= data.ingredients.total_pages)
        ? 'invisible'
        : 'visible'}"
    >
      {#if !showFilterMenu && $currentPage > 1}
        <button
          id="prevPage"
          on:mousedown={() => changePage(-1)}
          class="transition-all hover:-translate-x-2 active:scale-90"
        >
          <ArrowLeftIcon />
        </button>
      {/if}
      {#if !showFilterMenu && $currentPage < data.ingredients.total_pages}
        <button
          id="nextPage"
          on:mousedown={() => changePage(1)}
          class="transition-all hover:translate-x-2 active:scale-90"
        >
          <ArrowRightIcon />
        </button>
      {/if}
    </div>

  </form>

  <div
  id="table-wrapper"
    class="flex w-full flex-col items-center justify-center my-8"
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
            class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full"
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
