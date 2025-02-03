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
    use:enhance={() =>
      notification.set({ message: "Formula Created", type: "success" })}
  >
    <CreateButton />
  </form>
</SearchBar>

<div id="table-wrapper" class="my-8 flex w-full items-center justify-center">
  <div
    id="card-holder"
    class="grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
  >
    {#each formulas as formula}
      <FormulateCard {formula} />
    {/each}
  </div>
</div>
