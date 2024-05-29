<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { writable } from "svelte/store";
  import { fade } from "svelte/transition";
  import {createFormula, fetchFormulas, fetchFormula } from "$lib/DjangoAPI";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import FormulaDetail from "./FormulaDetail.svelte";
    import AddCrossIcon from "$lib/icons/AddCrossIcon.svelte";
  
  // main functionality
  let formulae = null;
  let formulaDetail = null;
  let cleanup = () => {};
  let notification = writable("");
  let isLoading = true;
  let activeFormulaId = null;


  onMount(async () => {
    let is_authenticated = sessionStorage.getItem("is_authenticated");
  if (is_authenticated === "false" || is_authenticated === null) {
    window.location.href = "/auth/login";
  }
  formulae = await fetchFormulas()
  
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
      formulaDetail = null;  // Optionally toggle detail view off if the same button is clicked again
      activeFormulaId = null;
      
    } else {
      fetchFormulaDetail(formulaId);
      activeFormulaId = formulaId;  // Update the active formula ID
      
      console.log(activeFormulaId)
    }
  }  
  async function handleCreateFormula() {
    let data = await createFormula();
    

    notification.set("new formula created");
    formulae = await fetchFormulas({forceReload: true });
  }

  function handleKeydown(event) {
      if (event.key === "Escape") {
        formulaDetail = null;
        activeFormulaId = null;
      }
    }

</script>
<svelte:window on:keydown={handleKeydown}/>
<svelte:head>
  <title>BCF | Formulate</title>
</svelte:head>

<div class=" flex flex-col min-h-screen">
  <Header currentPage="formulate" notification = {notification}/>
  <div class="mb-auto flex justify-center items-center">
    {#if isLoading}
    <Loader />
    {:else}
    <div id="app" class="flex flex-row rounded-lg items-stretch w-[1200px] h-[600px] my-12 text-lime-950  caret-lime-700 select-text selection:bg-lime-300"
    in:fade={{duration: 150}}
    >


  <div id="sidebar" class="flex flex-col rounded-lg transition-all text-lime-50 w-[180px]"
  in:fade={{delay:150, duration: 150}}
  >
    <ul id="formulate-list" class= "items-start flex flex-col space-y-2">
      {#each formulae as formula}
        <button class:active={formula.id === activeFormulaId} 
        id="formula-item" 
        class="flex text-left w-full group bg-lime-700 flex-col active:scale-95 hover:bg-lime-50 hover:text-lime-950 dark:hover:bg-lime-400 dark:hover:text-lime-200 rounded-lg hover:shadow p-2 transition-all" 
        on:mousedown={() => viewFormula(formula.id)} 
        title={formula.description}
        
        >
          <p id="formula-name" class="font-bold text-lg w-full truncate">{formula.name}</p>
          <p id="formula-edit-time" class="text-sm invisible group-hover:visible">{formula.updated}</p>
        </button>
      {/each}
      {#if formulae.length === 0}
      <button id="formula-item"
      class="flex flex-col text-2xl hover:bg-lime-600 hover:rounded-lg hover:shadow p-2 transition-all hover:translate-x-1 duration-150" on:mousedown={handleCreateFormula}>make it your first</button>
        {:else}
      <button id="formula-item"
      title="create new formula"
      class="flex rounded-full hover:bg-lime-700  p-2 items-center mt-auto text-lime-950 hover:text-lime-50 w-fit transition-all active-scale-90" on:mousedown={handleCreateFormula}>
        <AddCrossIcon />
      </button>
      {/if}
    </ul>
  </div>
  <div id="main-content" class="flex flex-row items-center justify-center flex-1 bg-white dark:bg-stone-800 rounded-lg shadow-md ml-8">
    {#if formulaDetail}
    <FormulaDetail bind:formulae bind:formulaDetail bind:notification />
    {:else}
    <div class="flex flex-col items-center">
      <h2 class="text-4xl font-semibold">welcome</h2>
      <p class="text-2xl">Select a formula to view</p>
    </div>
    {/if}
  </div>
  </div>
{/if}
</div>
  <Footer />
</div>

<style>
  .active {
    @apply bg-lime-600;
    @apply dark:bg-lime-800/40;
    @apply dark:text-lime-100/80;
    @apply shadow-inner;
  }
</style>
