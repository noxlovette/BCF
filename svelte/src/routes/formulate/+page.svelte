<script lang="ts">
  import {
    SearchBar,
    FormulateCard,
    CreateButton,
    Search,
    MetaData,
  } from "$lib/components";
  import { enhance } from "$app/forms";
  import { notification } from "$lib/stores";

  let { data } = $props();

  let { formulas } = data;
</script>

<MetaData title="BCF | Formulate" />

<SearchBar>
  <Search placeholder="Search for Formulas " />
  <form
    method="post"
    action="?/create"
    use:enhance={() => {
      return async ({ result, update }) => {
        if (result.type === "success") {
          notification.set({ message: "Suggestion Sent", type: "success" });
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
