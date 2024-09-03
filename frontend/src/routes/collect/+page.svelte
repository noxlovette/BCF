<script lang="ts">
  import { fetchCollection } from "$lib/DjangoAPI";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { goto } from "$app/navigation";
  import { blur } from "svelte/transition";
  import Loader from "$lib/components/Loader.svelte";
  import ArrowLeftIcon from "$lib/icons/ArrowLeftIcon.svelte";
  import ArrowRightIcon from "$lib/icons/ArrowRightIcon.svelte";
  import ResetIcon from "$lib/icons/ResetIcon.svelte";
  import CollectCardExpanded from "$lib/components/CollectCardExpanded.svelte";
  import CollectCard from "$lib/components/CollectCard.svelte";
  import { notification } from "$lib/stores/notificationStore";
  import AddCrossIcon from "$lib/icons/AddCrossIcon.svelte";

  export let collection = [];

  let pageSize = writable(9);
  let currentPage = writable(1);
  let searchTerm = writable("");
  let searchInput: any = null;
  let isLoading = true;
  let editedIngredient = null;
  let filteredCollection = [];
  let startIndex = 0;
  let paginatedCollection = [];

  async function handleFetch(forceReload = false) {
    const data = await fetchCollection({ forceReload: forceReload });
    return data;
  }

  async function reset() {
    searchTerm.set("");
    currentPage.set(1);
    collection = await handleFetch(true);
    editedIngredient = null;
    filteredCollection = collection;
  }

  // pagination logic, pagesize logic
  async function updatePageSize() {
    currentPage.set(1);
    goto(
      `/collect?page=${$currentPage}&search=${$searchTerm}&page_size=${$pageSize}`,
    );
  }

  async function changePage(increment) {
    if (
      $currentPage + increment >= 1 &&
      $currentPage + increment <= totalPages
    ) {
      currentPage.update((value) => value + increment);
      notification.set({
        message: `you are on page ${$currentPage}`,
        type: "info",
      });
    } else {
      notification.set({
        message: `there is nothing to seek there`,
        type: "error",
      });
    }
  }

  async function handleSearch() {
    currentPage.set(1);
    if ($searchTerm === "") {
      notification.set({ message: "Showing everything", type: "info" });
    } else {
      notification.set({
        message: `Searching for ${$searchTerm}...`,
        type: "info",
      });
    }
    goto(
      `/collect?page=${$currentPage}&search=${$searchTerm}&page_size=${$pageSize}`,
    );
  }

  const handleSearchCollection = () => {
    filteredCollection = collection.filter((ingredient) => {
      const commonName = ingredient.common_name || "";
      const cas = ingredient.cas || "";
      return (
        commonName.toLowerCase().includes($searchTerm.toLowerCase()) ||
        cas.toLowerCase().includes($searchTerm.toLowerCase())
      );
    });
  };

  // Compute the start index for slicing the array based on the current page and page size
  $: {
    startIndex = ($currentPage - 1) * $pageSize;
  }

  let totalPages: number = 0;

  $: {
    try {
      paginatedCollection = filteredCollection.slice(
        startIndex,
        startIndex + $pageSize,
      );
      totalPages = Math.ceil(filteredCollection.length / $pageSize);
    } catch (error) {
      console.log(error);
    }
  }

  function feedCustomIngredient() {
    editedIngredient = {
      id: null,
      common_name: "",
      cas: "",
      volatility: "",
      use: "",
    };
    chosenIngredient = editedIngredient;
  }

  onMount(async () => {
    let is_authenticated = sessionStorage.getItem("is_authenticated");
    if (is_authenticated === "false" || is_authenticated === null) {
      notification.set({
        message: "Please log in to access this page",
        type: "error",
      });
      goto("/auth/login");
    } else {
      currentPage.set(
        parseInt(sessionStorage.getItem("currentPageCollect")) || 1,
      );
      pageSize.set(parseInt(localStorage.getItem("pageSizeCollect")) || 10);
      searchTerm.set(sessionStorage.getItem("searchTermCollect") || "");
    }

    collection = await handleFetch();
    if (collection) {
      isLoading = false;
    }

    filteredCollection = collection;
    currentPage.subscribe((value) =>
      sessionStorage.setItem("currentPageCollect", value.toString()),
    );
    pageSize.subscribe((value) =>
      localStorage.setItem("pageSizeCollect", value.toString()),
    );
    searchTerm.subscribe((value) => {
      sessionStorage.setItem("searchTermCollect", value);
    });
  });

  let chosenIngredient: any = null;
  function toggleOverlay() {
    chosenIngredient = null;
    editedIngredient = null;
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
    } else if (event.key === "Escape") {
      if (document.activeElement === searchInput) {
        searchInput.blur();
        searchTerm.set("");
      } else {
        event.preventDefault();
        toggleOverlay();
      }
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      changePage(-1);
    } else if (event.key === "ArrowRight") {
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

  const description =
    "Collect perfume ingredients. Leave comments, manage your laboratory.";
  const ogTitle = "BCF | Collect";
  const ogUrl = "https://bcfapp.app/collect";
  const imageUrl = "https://bcfapp.app/assets/img/dalle-collect-1.webp";
</script>

<svelte:window on:keydown={handleKeydown} />

<svelte:head>
  <title>BCF | Collect</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={ogTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={imageUrl} />
  <meta property="og:url" content={ogUrl} />
</svelte:head>

<button
  id="overlay"
  class="fixed left-0 top-0 z-30 flex h-full w-full items-center justify-center bg-stone-900 bg-opacity-20 bg-blend-darken backdrop-blur transition-all"
  class:hidden={!chosenIngredient}
  on:mousedown={toggleOverlay}
  aria-label="Toggle Overlay"
>
  <div>
    <CollectCardExpanded
      ingredient={chosenIngredient}
      bind:filteredCollection
      bind:collection
      bind:editedIngredient
      bind:chosenIngredient
    />
  </div>
</button>

<div id="app" class="my-8 flex flex-col items-center lowercase caret-grapefruit-700">
  <form
    id="search-bar"
    class="group flex w-full max-w-5xl flex-col items-center justify-center space-x-0 space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 sm:px-12 lg:max-w-5xl"
  >
    <button
      class="rounded-full border border-grapefruit-700 bg-grapefruit-700 p-2 text-grapefruit-50 shadow transition-all hover:bg-white hover:text-grapefruit-700 hover:shadow-lg active:shadow-none dark:hover:bg-stone-800"
      on:mousedown={feedCustomIngredient}
    >
      <AddCrossIcon />
    </button>
    <input
      type="text"
      class="w-[250px] rounded-lg border-none bg-white shadow transition-all hover:shadow-lg focus:scale-95 focus:ring-2 focus:ring-grapefruit-700/60 active:scale-90 md:w-[325px] lg:w-[600px] dark:bg-stone-800"
      bind:value={$searchTerm}
      bind:this={searchInput}
      on:input={handleSearchCollection}
      placeholder="/ search ingredients..."
      title="find an ingredient by CAS or the multiple names that it might have"
    />

    <button
      on:mousedown={reset}
      title="reset everything"
      class="hidden rounded-full border border-grapefruit-700 bg-grapefruit-700 p-2 text-grapefruit-50 shadow transition-all hover:bg-white hover:text-grapefruit-700 hover:shadow-lg active:shadow-none sm:block dark:hover:bg-stone-800"
    >
      <ResetIcon />
    </button>

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

    <div
      id="pagination"
      class="group flex w-[100px] items-center justify-center rounded-full border border-grapefruit-700 bg-grapefruit-700 p-2 text-grapefruit-50 shadow transition-all hover:bg-white hover:text-grapefruit-700 hover:shadow-lg active:shadow-none dark:hover:bg-stone-800 {$currentPage <=
        1 && $currentPage >= totalPages
        ? 'invisible'
        : 'visible'}"
    >
      {#if $currentPage > 1}
        <button
          id="prevPage"
          on:mousedown={() => changePage(-1)}
          class="transition-all hover:-translate-x-2 active:scale-90"
        >
          <ArrowLeftIcon />
        </button>
      {/if}
      {#if $currentPage < totalPages}
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
    class="ml-6 mr-6 mt-0 flex h-full flex-row items-center overflow-x-auto overflow-y-auto p-2 text-sm"
  >
    {#if isLoading || collection === null}
      <Loader />
    {:else if filteredCollection.length === 0}
    <p class="m-12 text-5xl text-center">hm. try a different search?</p>
    {:else}
      <div id="wrapper" class="rounded-lg p-8" in:blur={{ duration: 150 }}>
        <div
          id="card-holder"
          class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
        >
          {#each paginatedCollection as ingredient}
            {#if ingredient}
              <CollectCard
                {ingredient}
                bind:chosenIngredient
                bind:filteredCollection
              />
            {/if}
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>
