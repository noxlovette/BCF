<script lang="ts">
  import {
    SearchBar,
    FormulateCard,
    CreateButton,
    Search,
    MetaData,
    PerPage,
    Pagination,
    CardHolder,
    H1,
  } from "$lib/components";
  import { enhance } from "$app/forms";
  import { notification } from "$lib/stores";

  let { data } = $props();

  function handleSave() {
    return async ({ result, update }) => {
      if (result.type === "redirect") {
        notification.set({
          message: "New Formula Created",
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

<MetaData title="BCF | Formulate" />

<SearchBar colour="hunter">
  <Search placeholder="Search Formulas..." />
  <PerPage />

  <form method="post" action="?/create" use:enhance={handleSave}>
    <CreateButton />
  </form>
  <Pagination />
</SearchBar>

<div id="table-wrapper" class="my-4 flex w-full items-center justify-center">
  {#if data.formulas.length === 0}
    <div class="flex max-w-4xl flex-col items-center justify-center space-y-8">
      <H1>Looks Lonely Here</H1>
      <p
        class="font-quicksand text-center text-4xl tracking-tighter text-balance"
      >
        No formulas found. You can always create new ones.
      </p>
      <div class="flex space-x-2">
        <form method="post" action="?/create" use:enhance={handleSave}>
          <button
            class="bg-hunter-600 hover:bg-hunter-700 text-hunter-50 rounded-lg px-4 py-2 font-bold transition-all"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  {:else}
    <CardHolder>
      {#each data.formulas as formula}
        <FormulateCard {formula} />
      {/each}
    </CardHolder>
  {/if}
</div>
