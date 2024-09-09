<script lang="ts">
  import { onMount } from "svelte";

  import { goto, invalidateAll } from "$app/navigation";

  import Loader from "$lib/components/Loader.svelte";
  import ArrowLeftIcon from "$lib/icons/ArrowLeftIcon.svelte";
  import ArrowRightIcon from "$lib/icons/ArrowRightIcon.svelte";
  import ResetIcon from "$lib/icons/ResetIcon.svelte";

  import CollectCard from "$lib/components/CollectCard.svelte";
  import { notification } from "$lib/stores/notificationStore";
  import AddCrossIcon from "$lib/icons/AddCrossIcon.svelte";
  import MetaData from "$lib/components/MetaData.svelte";
  import { handleKeydown } from "$lib/utils";
  import { currentPage, pageSize, searchTerm } from "$lib/stores";
    import type { PageData } from "../$types";


    import { changePage } from "$lib/utils";
    import Pagination from "$lib/components/UI/Pagination.svelte";

  export let data:PageData;
  let collection = data.collection;
  let searchInput: any = null;
  let editedIngredient = null;
  let filteredCollection = [];
  let startIndex = 0;
  let paginatedCollection = [];
  let chosenIngredient: any = null;
  let totalPages: number = 0;  

  async function reset() {
    invalidateAll();
    notification.set({
      message: "resetting everything",
      type: "info",
    });
    searchTerm.set("");
    currentPage.set(1);
    editedIngredient = null;
    filteredCollection = collection;
  }

  async function updatePageSize() {
    currentPage.set(1);
    await goto(
      `/collect?page=${$currentPage}&search=${$searchTerm}&page_size=${$pageSize}`,
    );
  }

  async function handleChangePage(increment:number) {
    const newPage = await changePage(increment, totalPages, $currentPage);
    currentPage.set(newPage);
  };


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

  $: {
    startIndex = ($currentPage - 1) * $pageSize;
  }


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
      currentPage.set(
        parseInt(sessionStorage.getItem("currentPageCollect")) || 1,
      );
      pageSize.set(parseInt(localStorage.getItem("pageSizeCollect")) || 24);
      searchTerm.set(sessionStorage.getItem("searchTermCollect") || "");

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


  
</script>

<MetaData title="BCF | Collect" ogTitle="BCF | Collect" description="Collect perfume ingredients. Leave comments, manage your laboratory." ogUrl="https://bcfapp.app/collect" />
<svelte:window on:keydown={handleKeydown(searchInput, handleChangePage, $searchTerm)} />



<div id="app" class="flex flex-col lowercase caret-grapefruit-700">
  <form
    id="search-bar"
    class="group flex w-full flex-col items-center justify-between space-x-0 space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
  >
    <button
      class="rounded-full border border-grapefruit-700 bg-grapefruit-700 p-2 text-grapefruit-50 shadow transition-all hover:bg-white hover:text-grapefruit-700 hover:shadow-lg active:shadow-none dark:hover:bg-stone-800"
      on:mousedown={feedCustomIngredient}
    >
      <AddCrossIcon />
    </button>
    <input
      type="text"
      class="rounded-lg border-none w-full md:w-1/2 bg-white shadow transition-all hover:shadow-lg focus:scale-95 focus:ring-2 focus:ring-grapefruit-700/60 active:scale-90  dark:bg-stone-800"
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


    <Pagination on:nextPage={() => handleChangePage(1)} on:prevPage={() => handleChangePage(-1)} />
    
  </form>

  <div
    id="table-wrapper"
    class="flex w-full items-center justify-center my-8"
  >
    {#if collection === null}
      <Loader />
    {:else if filteredCollection.length === 0}
    <p class="m-12 text-5xlr">Hm. Try a different search?</p>
    {:else}
        <div
          id="card-holder"
          class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full"
        >
          {#each paginatedCollection as ingredient}          
            {#if ingredient}
              <CollectCard
                {ingredient}
              />
            {/if}
          {/each}
        </div>
    {/if}
  </div>
</div>
