<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { writable } from "svelte/store";
  import { fade } from "svelte/transition";
  import {createFormula, fetchFormulas, fetchFormula } from "$lib/DjangoAPI";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import FormulaDetail from "./FormulaDetail.svelte";
  
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

<div class=" flex flex-col min-h-screen" style="background: url('/assets/bg/bbblurry-formulate.svg') no-repeat center center fixed; background-size: cover;">
  <Header currentPage="formulate" notification = {notification}/>
  <div class="mb-auto flex justify-center items-center">
    {#if isLoading}
    <Loader />
    {:else}
    <div id="app" class="flex flex-row rounded-lg shadow items-stretch size-5/6 m-2 mt-0 p-4 text-amber-950/90 dark:text-amber-200/80 bg-amber-600/30"
    in:fade={{duration: 150}}
    >
  <div id="sidebar" class="flex flex-col w-1/6 hover:w-1/5 mr-auto bg-lime-800/70 dark:bg-lime-900/70 text-amber-100/90 rounded-lg drop-shadow p-4 transition-all duration-500"
  in:fade={{delay:150, duration: 150}}
  >
    <h2 id="formula-header" class= "text-4xl font-semibold mb-4 border-b-2 border-amber-100/20">my formulae</h2>
    <ul id="formulate-list" class= "tracking-tight divide-y-4 divide-amber-100/20 items-start flex flex-col">
      {#each formulae as formula}
        <button class:active={formula.id === activeFormulaId} 
        id="formula-item" 
        class="flex text-left flex-col w-5/6 hover:w-3/4 hover:py-4 hover:translate-x-1 active:scale-95 hover:bg-amber-50/80 hover:text-amber-800/80 dark:hover:bg-amber-400/30 dark:hover:text-amber-200 hover:rounded-lg hover:shadow p-2 transition-all duration-150" 
        on:click={() => viewFormula(formula.id)} 
        title={formula.description}
        
        >
          <p id="formula-name" class="font-semiboldtext-lg">{formula.name}</p>
          <p id="formula-edit-time" class="font-bold text-sm">{formula.updated}</p>
        </button>
      {/each}
      {#if formulae.length === 0}
      <button id="formula-item" class="flex flex-col text-2xl hover:bg-amber-600/30 hover:rounded-lg hover:shadow p-2 transition-all hover:translate-x-1 duration-150" on:click={handleCreateFormula}>make it your first</button>
        {:else}
        
      <button id="formula-item" class="flex w-5/6 hover:bg-amber-600/30 hover:rounded-lg hover:shadow p-2 transition-all hover:scale-105 active-scale-90 duration-500" on:click={handleCreateFormula}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </button>
      {/if}
    </ul>
  </div>
  <div id="main-content" class="flex flex-row items-center justify-center flex-1 p-4 bg-amber-50/80 dark:bg-amber-800/10 rounded-lg shadow ml-4">
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
    @apply bg-amber-50/90;
    @apply text-amber-900/90;
    @apply dark:bg-amber-800/40;
    @apply dark:text-amber-100/80;
    @apply rounded-lg;
    @apply shadow;
  }
</style>
