<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { createFormula, fetchFormulas, fetchFormula } from "$lib/DjangoAPI";
  import Loader from "$lib/components/Loader.svelte";
  import FormulaDetail from "./FormulaDetail.svelte";
  import AddCrossIcon from "$lib/icons/AddCrossIcon.svelte";
  import { notification } from "$lib/stores/notificationStore";
  import { goto } from "$app/navigation";
    import MetaData from "$lib/components/MetaData.svelte";

  let formulae = null;
  let formulaDetail = null;
  let cleanup = () => {};
  let isLoading = true;
  let activeFormulaId = null;

  onMount(async () => {
    let is_authenticated = sessionStorage.getItem("is_authenticated");
    if (is_authenticated === "false" || is_authenticated === null) {
      goto("/auth/login");
      notification.set({
        message: "Please log in to access this page",
        type: "error",
      });
    }
    formulae = await fetchFormulas();

    if (formulae) isLoading = false;
  });

  onDestroy(() => {
    cleanup();
  });

  async function fetchFormulaDetail(formulaId) {
    formulaDetail = await fetchFormula(formulaId);
  }

  function viewFormula(formulaId) {
    if (formulaId === activeFormulaId) {
      formulaDetail = null; 
      activeFormulaId = null;
    } else {
      fetchFormulaDetail(formulaId);
      activeFormulaId = formulaId; 
    }
  }
  async function handleCreateFormula() {
    let data = await createFormula();
    notification.set({ message: "new formula created", type: "success" });
    formulae = await fetchFormulas({ forceReload: true });
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      formulaDetail = null;
      activeFormulaId = null;
    }
  }
</script>

<MetaData title="BCF | Formulate" />

<div class="flex h-full items-center justify-center md:hidden">
  <h1 class="text-xl font-bold">this page is desktop only :(</h1>
</div>

{#if isLoading}
  <Loader />
{:else}
  <div
    id="app"
    class="my-12 hidden h-[550px] select-text overflow-x-auto text-aqua-950 caret-aqua-700 selection:bg-aqua-300 md:flex md:w-[720px] md:flex-row lg:w-[960px] xl:w-[1200px] dark:text-aqua-50"
  >
    <div
      id="sidebar"
      class="flex flex-col rounded-lg text-aqua-50 transition-all md:w-[120px] xl:w-[180px]"
    >
      <ul
        id="formulate-list"
        class="flex h-full flex-col items-start space-y-2 overflow-y-auto"
      >
        {#each formulae as formula}
          <button
            class:active={formula.id === activeFormulaId}
            id="formula-item"
            class="group flex w-full flex-col rounded-lg bg-aqua-700 p-4 text-left transition-all hover:bg-aqua-50 hover:text-aqua-950 hover:shadow active:scale-95 dark:bg-aqua-800 dark:hover:bg-aqua-950 dark:hover:text-aqua-50"
            on:mousedown={() => viewFormula(formula.id)}
            title={formula.description}
          >
            <p id="formula-name" class="w-full truncate text-lg font-bold">
              {formula.name}
            </p>
            <p
              id="formula-edit-time"
              class="invisible text-sm group-hover:visible"
            >
              {formula.updated}
            </p>
          </button>
        {/each}
      </ul>
      <button
        id="formula-item"
        title="create new formula"
        class="active-scale-90 mt-auto flex w-fit items-center rounded-full p-2 text-aqua-950 transition-all hover:bg-aqua-700 hover:text-aqua-50 dark:text-aqua-50"
        on:mousedown={handleCreateFormula}
      >
        <AddCrossIcon />
      </button>
    </div>

    <div
      id="main-content"
      class="ml-8 flex flex-1 flex-row items-center justify-center rounded-lg bg-white shadow-md dark:bg-stone-800"
    >
      {#if formulaDetail}
        <FormulaDetail bind:formulae bind:formulaDetail />
      {:else}
        <div class="flex flex-col items-center">
          <h2 class="text-4xl font-semibold">welcome</h2>
          <p class="text-2xl">Select a formula to view</p>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .active {
    @apply bg-aqua-600;
    @apply dark:bg-aqua-800/40;
    @apply dark:text-aqua-100/80;
    @apply shadow-inner;
  }
</style>
