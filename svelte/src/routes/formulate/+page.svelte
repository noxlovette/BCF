<script lang="ts">
  import {
    SearchBar,
    FormulateCard,
    CreateButton,
    Search,
    MetaData,
    PerPage,
    Pagination,
  } from "$lib/components";
  import { enhance } from "$app/forms";
  import { notification } from "$lib/stores";

  let { data } = $props();

  let { formulas } = data;
</script>

<MetaData title="BCF | Formulate" />

<SearchBar colour="hunter">
  <Search placeholder="Search Formulas..." />
  <PerPage />

  <form
    method="post"
    action="?/create"
    use:enhance={() => {
      return async ({ result, update }) => {
        if (result.type === "redirect") {
          notification.set({ message: "Formula Created", type: "success" });
          update();
        } else if (result.type === "error") {
          notification.set({
            message: String(result.error?.message) || "Something's off",
            type: "error",
          });
        }
      };
    }}
  >
    <CreateButton />
  </form>
  <Pagination />
</SearchBar>

<div id="table-wrapper" class="my-8 flex w-full items-center justify-center">
  {#if formulas.length === 0}
    <p class="m-12 text-5xl">Looks Lonely Here</p>
  {:else}
    <div
      id="card-holder"
      class="grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
    >
      {#each formulas as formula}
        <FormulateCard {formula} />
      {/each}
    </div>
  {/if}
</div>
