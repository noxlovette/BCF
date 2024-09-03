<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { fetchDescriptors, fetchIngredientsBrowse } from "$lib/DjangoAPI";
  import { tick } from "svelte";
  import { writable } from "svelte/store";
  import { blur, fade } from "svelte/transition";

  import Loader from "$lib/components/Loader.svelte";
  import BrowseCardExpanded from "$lib/components/BrowseCardExpanded.svelte";
  import BrowseCard from "$lib/components/BrowseCard.svelte";
  import { notification } from "$lib/stores/notificationStore";
  import ArrowLeftIcon from "$lib/icons/ArrowLeftIcon.svelte";
  import ArrowRightIcon from "$lib/icons/ArrowRightIcon.svelte";
  import ResetIcon from "$lib/icons/ResetIcon.svelte";

  export let data: any = null;
  export let currentPage = writable();
  export let pageSize = writable();
  export let searchTerm = writable("");
  let overlay: boolean = false;
  let suggestedIngredient = null;
  let chosenIngredient: any = null;
  let chosenDescriptors = [];
  let showFilterMenu = false;
  let searchInput;
  let showSuggestion = false;

  interface Field {
    name: string;
    visible: boolean;
  }

  interface Ingredient {
    [key: string]: string; // Index signature for dynamic properties
  }

  let showTuneMenu = false;
  let isLoading = true;
  let descriptors = [];
  let searchTermDescriptor = "";
  let filteredDescriptors = [];
  let sortedDescriptors = [];

  onMount(async () => {
    // Set currentPage and searchTerm based on the initial props
    currentPage.set(parseInt(sessionStorage.getItem("currentPage")) || 1);
    pageSize.set(parseInt(localStorage.getItem("pageSize")) || 9);
    searchTerm.set(sessionStorage.getItem("searchTerm") || "");
    data = await load();
    isLoading = false;

    descriptors = await fetchDescriptors();
    filteredDescriptors = descriptors;

    currentPage.subscribe((value) =>
      sessionStorage.setItem("currentPage", String(value)),
    );
    pageSize.subscribe((value) =>
      localStorage.setItem("pageSize", String(value)),
    );
    searchTerm.subscribe((value) =>
      sessionStorage.setItem("searchTerm", String(value)),
    );
  });

  function sortDescriptors(descriptors) {
    return descriptors.sort((a, b) => a.name.localeCompare(b.name));
  }

  $: {
    sortedDescriptors = sortDescriptors(filteredDescriptors);
    if (chosenDescriptors.length > 0) {
      let descriptorNames = chosenDescriptors.map(
        (descriptor) => descriptor.name,
      );
      notification.set({ message: descriptorNames.join(", "), type: "info" });
      fetchWithDescriptors();
    }
  }

  let filterMenu;
  function handleClickOutside(event) {
    if (
      filterMenu &&
      !filterMenu.contains(event.target) &&
      !searchInput.contains(event.target)
    ) {
      console.log("clicked outside");
      document.removeEventListener("click", handleClickOutside);
      showFilterMenu = false;
    }
  }

  async function fetchWithDescriptors() {
    currentPage.set(1);
    data = await load();
  }

  function handleKeydown(event) {
    if (event.key === "/") {
      event.preventDefault(); // Prevents the default action associated with the '/' key

      // Toggle focus
      if (document.activeElement === searchInput) {
        searchInput.blur(); // If the searchInput is already focused, unfocus it
      } else {
        searchInput.focus(); // Otherwise, set the focus on the searchInput
      }
    } else if (
      event.key === "ArrowLeft" &&
      document.activeElement !== searchInput
    ) {
      event.preventDefault();
      changePage(-1);
    } else if (
      event.key === "ArrowRight" &&
      document.activeElement !== searchInput
    ) {
      event.preventDefault();
      changePage(+1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      changePage(-1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      changePage(+1);
    }
  }

  async function load(): Promise<IngredientsBrowseResult | null> {
  try {
    const result = await fetchIngredientsBrowse(
      Number($currentPage),
      String($searchTerm),
      Number($pageSize),
      chosenDescriptors,
    );

    if (!result) {
      console.warn("fetchIngredientsBrowse returned null or undefined");
      return null;
    }

    // Ensure the result has the expected structure
    return {
      results: Array.isArray(result.results) ? result.results : [],
      total_pages: typeof result.total_pages === 'number' ? result.total_pages : 1,
      count: typeof result.count === 'number' ? result.count : 0
    };

  } catch (error) {
    console.error("Error in load function:", error);
    return null;
  }
}

  async function reset() {
    searchTerm.set("");
    currentPage.set(1);
    chosenDescriptors = [];
    notification.set({ message: "resetting everything...", type: "info" });
    goto(
      `/browse?page=${$currentPage}&search=${$searchTerm}&page_size=${$pageSize}`,
    );
    data = await load();
  }

  async function searchIngredients() {
    currentPage.set(1);
    if ($searchTerm === "") {
      notification.set({ message: "Showing all ingredients", type: "info" });
    } else {
      notification.set({
        message: `Searching for ${$searchTerm}...`,
        type: "info",
      });
    }
    goto(
      `/browse?page=${$currentPage}&search=${$searchTerm}&page_size=${$pageSize}`,
    );

    data = await load();
  }

  function handleSearch(event) {
    if (event.key === "Enter") {
      searchIngredients();
    } else if (event.key === "Escape") {
      searchTerm.set("");
      searchInput.blur();
      searchIngredients();
    }
  }

  const searchDescriptors = () => {
    return (filteredDescriptors = descriptors.filter((descriptor) =>
      descriptor.name
        .toLowerCase()
        .includes(searchTermDescriptor.toLowerCase()),
    ));
  };

  async function changePage(increment: number) {
  try {
    if (document.activeElement === searchInput) {
      await searchIngredients();
      return;
    }

    const newPage = $currentPage + increment;

    if (data && (newPage < 1 || newPage > data.total_pages)) {
      notification.set({
        message: `There is nothing to seek there`,
        type: "error",
      });
      return;
    }

    currentPage.update((value) => value + increment);
    
    try {
      await goto(`/browse?page=${newPage}&search=${$searchTerm}&page_size=${$pageSize}`);
      
      data = await load();
      
      if (data === null) {
        throw new Error("Failed to load data");
      }
      
      const message = `You are on page ${newPage}/${data.total_pages}`;
      notification.set({ message: message, type: "info" });
    } catch (error) {
      console.error("Navigation or data loading error:", error);
      notification.set({
        message: "Failed to load the next page. Please try again.",
        type: "error",
      });
      // Revert the page change
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

  async function updatePageSize() {
    goto(
      `/browse?page=${$currentPage}&search=${$searchTerm}&page_size=${$pageSize}`,
    );
    data = await load(); // Wait for the URL to be updated before loading new data
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

  function toggleOverlay() {
    chosenIngredient = null;
    showSuggestion = false;
    suggestedIngredient = null;
  }

  const description = "Browse perfume compounds. IFRA FIG.";
  const ogTitle = "BCF | Browse";
  const ogUrl = "https://bcfapp.app/browse";
  const imageUrl = "https://bcfapp.app/assets/img/dalle-browse-4.webp";
</script>

<svelte:window class="dark:text-stone-100" on:keydown={handleKeydown} />
<svelte:head>
  <title>BCF | Browse</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={ogTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={imageUrl} />
  <meta property="og:url" content={ogUrl} />
</svelte:head>

<button
  id="overlay"
  class="fixed left-0 top-0 z-30 flex h-full w-full items-center justify-center bg-black bg-opacity-50 backdrop-blur transition-all"
  class:hidden={!chosenIngredient}
  on:mousedown={toggleOverlay}
  aria-label="Toggle Overlay"
>
  <div>
    <BrowseCardExpanded
      ingredient={chosenIngredient}
      bind:showSuggestion
      bind:suggestedIngredient
    />
  </div>
</button>

<div id="app" class="md:my-8 flex flex-col items-center lowercase caret-navy-700">
  <form
    id="search-bar"
    class="group flex w-full max-w-5xl flex-col items-center justify-center space-x-0 space-y-4 px-8 lg:px-12 sm:flex-row sm:space-x-4 sm:space-y-0"
  >

  <div class="flex-row w-full flex space-x-2 md:space-x-4">
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

    {#if showFilterMenu}
      <input
        type="text"
        class="w-full rounded-lg border-none bg-white shadow transition-all hover:shadow-lg focus:scale-95 focus:ring-2 focus:ring-navy-400/70 active:scale-90 lg:w-[600px] dark:bg-stone-800"
        bind:value={searchTermDescriptor}
        bind:this={searchInput}
        on:keydown={searchDescriptors}
        placeholder="/ search descriptors..."
        title="find the descriptor that you are looking for"
      />
    {:else}
      <input
        type="text"
        class="w-full rounded-lg border-none bg-white shadow transition-all hover:shadow-lg focus:scale-95 focus:ring-2 focus:ring-navy-700/60 active:scale-90 lg:w-[600px] dark:bg-stone-800"
        bind:value={$searchTerm}
        bind:this={searchInput}
        on:keydown={handleSearch}
        placeholder="/ search ingredients..."
        title="find an ingredient by CAS or the multiple names that it might have"
      />
    {/if}

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
        on:change={updatePageSize}
      />
    </label>

  </div>
<div class="flex flex-row md:space-x-0 space-x-4">
    <button
      on:mousedown={toggleFilterMenu}
      title="filter by descriptors"
      class="rounded-full md:hidden border border-navy-700 bg-navy-700 p-2 text-center text-navy-50 shadow transition-all hover:bg-white hover:text-navy-700 hover:shadow-lg active:shadow-none dark:hover:bg-stone-800 dark:hover:text-stone-50"
    >
      {#if showFilterMenu}
        ingredients
      {:else}
        descriptors
      {/if}
    </button>

    <div
      id="pagination"
      class="flex w-[100px] items-center justify-center rounded-full border border-navy-700 bg-navy-700 p-2 text-navy-50 shadow hover:bg-white hover:text-navy-700 active:shadow-none dark:hover:bg-stone-800 dark:hover:text-stone-50 {showFilterMenu ||
      ($currentPage <= 1 && $currentPage >= data.total_pages)
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
      {#if !showFilterMenu && $currentPage < data.total_pages}
        <button
          id="nextPage"
          on:mousedown={() => changePage(1)}
          class="transition-all hover:translate-x-2 active:scale-90"
        >
          <ArrowRightIcon />
        </button>
      {/if}
    </div>
  </div>
  </form>

  <div
    id="table-wrapper"
    class=" lg:mx-8 flex select-text flex-row items-center font-normal selection:bg-navy-300/40 xl:font-medium
          "
  >
    {#if isLoading || data === null}
      <!-- If isLoading is true, display a loading message -->
      <Loader />
    {:else if data.results.length === 0}
      <!-- If there are no results, display a message -->
      <p class="m-12 text-5xl text-center">hm. try a different search?</p>
    {:else}
      <div id="wrapper" class="rounded-lg p-8" in:blur={{ duration: 150 }}>
        {#if showFilterMenu}
          <div
            id="filter"
            class="grid w-full items-center gap-4 rounded-lg border-none bg-white/20 p-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 dark:bg-stone-900/20"
            in:fade={{ duration: 150 }}
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
        {:else}
          <div
            id="card-holder"
            class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
          >
            {#each data.results as ingredient}
              {#if ingredient}
                <BrowseCard {ingredient} bind:chosenIngredient />
              {/if}
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
