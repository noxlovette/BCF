<script>
  import { onDestroy, onMount } from "svelte";
  import { writable } from "svelte/store";
  import Header from "$lib/components/Header.svelte";
  import { fade } from "svelte/transition";
  import Footer from "$lib/components/Footer.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import {createFormulaAPI, fetchFormulaeApi, fetchFormulaApi } from "$lib/DjangoAPI.ts";
  import FormulaDetail from "./FormulaDetail.svelte";
  
  // main functionality
  let userId = 0;
  let formulae = [];
  let formulaDetail = null;
  let cleanup = () => {};
  let notification = writable("");
  let isLoading = true;


  onMount(async () => {
    let is_authenticated = sessionStorage.getItem("is_authenticated");
  if (is_authenticated === "false" || is_authenticated === null) {
    window.location.href = "/auth/login";
  }
  userId = sessionStorage.getItem("user_id");
  cleanup = () => {};
  fetchFormulae();
  
  if (formulae) isLoading = false;
  
  });
  
  onDestroy(() => {
    cleanup();
  });

  async function fetchFormulae() {
    formulae = await fetchFormulaeApi(userId);
  }

  async function fetchFormulaDetail(formulaId) {
    formulaDetail = await fetchFormulaApi(userId, formulaId);
  }

  function viewFormula(formulaId) {
    fetchFormulaDetail(formulaId);
  }
  
  async function createFormula() {
    let data = await createFormulaAPI(userId);
    console.log("created formula", data);

    notification.set("new formula created");
  }

  

</script>


<div class=" flex flex-col min-h-screen" style="background: url('/assets/bg/bbblurry-formulate.svg') no-repeat center center fixed; background-size: cover;">
  <Header currentPage="formulate" notification = {notification}/>
  <div class="mb-auto flex justify-center items-center">
    {#if isLoading}
    <Loader colour="lime" />
    {:else}
    <div id="app" class="flex flex-row rounded-lg shadow items-stretch size-5/6 m-2 mt-0 p-4 lowercase font-light text-amber-950/90 dark:text-amber-200/60 bg-amber-900/10"
    in:fade={{duration: 150}}
    >
  <div id="sidebar" class="flex flex-col w-1/6 hover:w-1/5 mr-auto bg-lime-800/70 dark:bg-lime-800/20 text-lime-200/80 rounded-lg drop-shadow p-4 transition-all duration-500"
  in:fade={{delay:150, duration: 150}}
  >
    <h2 id="formula-header" class= "text-4xl mb-4 border-b-2 border-amber-100/20">my formulae</h2>
    <ul id="formulate-list" class= "tracking-tight divide-y-2 divide-amber-100/20 items-start flex flex-col">
      {#each formulae as formula}
        <button id="formula-item" class="flex lowercase flex-col w-5/6 hover:translate-x-1  hover:bg-amber-50/80 hover:text-amber-800/80 dark:hover:bg-amber-800/20 dark:hover:text-amber-50/60 hover:rounded-lg hover:shadow p-2 transition-all duration-150" on:click={() => viewFormula(formula.id)} title={formula.description}>
          <p id="formula-name" class="font-regular text-lg">{formula.name}</p>
          <p id="formula-edit-time" class="font-thin">{formula.updated}</p>
        </button>
      {/each}
      <button id="formula-item" class="flex flex-col hover:bg-amber-600/30 hover:rounded-lg hover:shadow p-2 transition-all hover:translate-x-1 duration-150" on:click={createFormula}>create new formula</button>
    </ul>
  </div>
  <div id="main-content" class="flex flex-row items-start flex-1 p-4 bg-amber-50/80 dark:bg-amber-800/10 rounded-lg shadow ml-4">
    {#if formulaDetail}
    <FormulaDetail formulaDetail = {formulaDetail} userId = {userId} bind:formulae />
    {/if}
  </div>
  </div>
{/if}
</div>
  <Footer />
</div>

<style>
</style>
