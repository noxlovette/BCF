<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    CollectCard,
    CreateButton,
    MetaData,
    Search,
    SearchBar,
    CardHolder,
    PerPage,
    Pagination,
    H1,
  } from "$lib/components";
  import { notification } from "$lib/stores";
  import { currentPage, pageSize, searchTerm } from "$lib/stores";
  import { enhance } from "$app/forms";

  let { data } = $props();

  $inspect(data);

  $effect(() => {
    goto(
      `/collect?search=${$searchTerm}&page_size=${$pageSize}&page=${$currentPage}`,
      { noScroll: true, keepFocus: true },
    );
  });

  function handleSave() {
    return async ({ result, update }) => {
      if (result.type === "redirect") {
        notification.set({
          message: "New Ingredient Created",
          type: "success",
        });
        update();
      } else if (result.type === "error") {
        notification.set({
          message: String(result.error?.message) || "Something's off",
          type: "error",
        });
      }
    };
  }
</script>

<MetaData
  title="BCF | Collect"
  ogTitle="BCF | Collect"
  description="Collect perfume ingredients. Leave comments, manage your laboratory."
  ogUrl="https://bcfapp.app/collect"
/>

<SearchBar colour="wine">
  <Search />

  <PerPage />
  <form method="post" action="?/create" use:enhance={handleSave}>
    <CreateButton />
  </form>

  <Pagination />
</SearchBar>

<div
  id="table-wrapper"
  class="my-4 flex w-full flex-col items-center transition-all"
>
  {#if data.collection.length === 0}
    <div class="flex max-w-4xl flex-col items-center justify-center space-y-8">
      <H1>Looks Lonely Here</H1>
      <p
        class="font-quicksand text-center text-4xl tracking-tighter text-balance"
      >
        Nothing found in your collection. You can add new ingredients from the
        browse page or create your own.
      </p>
      <div class="flex space-x-2">
        <a
          href="browse"
          class="bg-ultra-600 hover:bg-ultra-700 text-ultra-50 rounded-lg px-4 py-2 font-bold transition-all"
        >
          Go Browse
        </a>
        <form method="post" action="?/create" use:enhance={handleSave}>
          <button
            class="bg-wine-600 hover:bg-wine-700 text-wine-50 rounded-lg px-4 py-2 font-bold transition-all"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  {:else}
    <CardHolder>
      {#each data.collection as ingredient}
        <CollectCard {ingredient} />
      {/each}
    </CardHolder>
  {/if}
</div>
