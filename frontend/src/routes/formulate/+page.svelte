<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";
  import {createFormula, fetchFormulas, fetchFormula } from "$lib/DjangoAPI";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import FormulaDetail from "./FormulaDetail.svelte";
    import AddCrossIcon from "$lib/icons/AddCrossIcon.svelte";
    import Notification from "$lib/components/Notification.svelte";
    import { notification } from '$lib/stores/notificationStore';
    import { goto } from "$app/navigation";
  
  // main functionality
  let formulae = null;
  let formulaDetail = null;
  let cleanup = () => {};
  let isLoading = true;
  let activeFormulaId = null;


  onMount(async () => {
    let is_authenticated = sessionStorage.getItem("is_authenticated");
  if (is_authenticated === "false" || is_authenticated === null) {
    goto("/auth/login");
    notification.set({message:"Please log in to access this page", type:"error"})
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
    }
  }  
  async function handleCreateFormula() {
    let data = await createFormula();
    notification.set({message:"new formula created", type:"success"});
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


<div class="flex md:hidden items-center justify-center h-full">
  <h1 class="text-xl font-bold">this page is desktop only :(</h1>
</div>
    
    {#if isLoading}
    <Loader />
    {:else}
    <div id="app" class="hidden md:flex md:flex-row md:w-[720px] overflow-x-auto lg:w-[960px] xl:w-[1200px] h-[550px] my-12 text-lime-950 dark:text-lime-50 caret-lime-700 select-text selection:bg-lime-300"
    in:fade={{duration: 150}}
    >
  <div id="sidebar" class="flex flex-col rounded-lg transition-all text-lime-50 md:w-[120px] xl:w-[180px]"
  in:fade={{delay:150, duration: 150}}
  >
    <ul id="formulate-list" class= "items-start h-full flex flex-col space-y-2 overflow-y-auto">
      {#each formulae as formula}
        <button class:active={formula.id === activeFormulaId} 
        id="formula-item" 
        class="flex text-left w-full group bg-lime-700 dark:bg-lime-800 flex-col active:scale-95 hover:bg-lime-50 hover:text-lime-950 dark:hover:bg-lime-950 dark:hover:text-lime-50 rounded-lg hover:shadow p-4 transition-all" 
        on:mousedown={() => viewFormula(formula.id)} 
        title={formula.description}
        
        >
          <p id="formula-name" class="font-bold text-lg w-full truncate">{formula.name}</p>
          <p id="formula-edit-time" class="text-sm invisible group-hover:visible">{formula.updated}</p>
        </button>
      {/each}
      
    </ul>
    <button id="formula-item"
      title="create new formula"
      class="flex rounded-full hover:bg-lime-700  p-2 items-center mt-auto text-lime-950 dark:text-lime-50 hover:text-lime-50 w-fit transition-all active-scale-90" on:mousedown={handleCreateFormula}>
        <AddCrossIcon />
      </button>
  </div>
  
  <div id="main-content" class="flex flex-row items-center justify-center flex-1 bg-white dark:bg-neutral-800 rounded-lg shadow-md ml-8">
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
    @apply bg-lime-600;
    @apply dark:bg-lime-800/40;
    @apply dark:text-lime-100/80;
    @apply shadow-inner;
  }
</style>
