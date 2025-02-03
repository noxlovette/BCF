<script lang="ts">
  import { goto } from "$app/navigation";
  import CreateButton from "$lib/components/UI/CreateButton.svelte";
  import CollectCard from "$lib/components/CollectCard.svelte";
  import MetaData from "$lib/components/MetaData.svelte";
  import PerPage from "$lib/components/UI/PerPage.svelte";
  import ResetButton from "$lib/components/UI/ResetButton.svelte";
  import { currentPage, pageSize, searchTerm } from "$lib/stores";

  import Pagination from "$lib/components/UI/Pagination.svelte";
  import AppWrap from "$lib/components/AppWrap.svelte";
  import SearchBar from "$lib/components/SearchBar.svelte";
  import Search from "$lib/components/UI/Search.svelte";
  import { notification } from "$lib/stores";
  import { enhance } from "$app/forms";
  import { fade } from "svelte/transition";
  import CardHolder from "$lib/components/CardHolder.svelte";

  let { data } = $props();
  let { collection } = data;

  $effect(() => {
    goto(
      `/collect?search=${$searchTerm}&page_size=${$pageSize}&page=${$currentPage}`,
      { noScroll: true, keepFocus: true },
    );

    notification.set({ message: `Current Page ${$currentPage}`, type: "info" });
  });
</script>

<MetaData
  title="BCF | Collect"
  ogTitle="BCF | Collect"
  description="Collect perfume ingredients. Leave comments, manage your laboratory."
  ogUrl="https://bcfapp.app/collect"
/>

<AppWrap class="text-center md:text-left">
  <SearchBar>
    <Search />

    <PerPage />
    <form
      method="post"
      action="?/create"
      use:enhance={() =>
        notification.set({
          message: "New Ingredient Created",
          type: "success",
        })}
    >
      <CreateButton on:create />
    </form>

    <form method="post" action="?/reset" use:enhance>
      <ResetButton />
    </form>

    <Pagination />
  </SearchBar>

  <div id="table-wrapper" class="my-8 flex w-full items-center justify-center">
    {#if collection.length === 0}
      <p class="m-12 text-5xl">Hm. Try a different search?</p>
    {:else}
      <CardHolder>
        {#each collection as ingredient}
          <CollectCard {ingredient} />
        {/each}
      </CardHolder>
    {/if}
  </div>
</AppWrap>
