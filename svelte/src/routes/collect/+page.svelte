<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    CollectCard,
    ResetButton,
    CreateButton,
    MetaData,
    Search,
    SearchBar,
    CardHolder,
    PerPage,
    Pagination,
  } from "$lib/components";
  import { notification } from "$lib/stores";
  import { enhance } from "$app/forms";
  import { currentPage, pageSize, searchTerm } from "$lib/stores";

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
    <p class="m-12 text-5xl">Looks Lonely Here</p>
  {:else}
    <CardHolder>
      {#each collection as ingredient}
        <CollectCard {ingredient} />
      {/each}
    </CardHolder>
  {/if}
</div>
