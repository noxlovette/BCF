<script lang="ts">
  import MetaData from "$lib/components/MetaData.svelte";
  import type { PageServerData } from "../$types";
  import FormulateCard from "$lib/components/FormulateCard.svelte";
  import type { Formula } from "$lib/types";

  import AppWrap from "$lib/components/AppWrap.svelte";
  import SearchBar from "$lib/components/SearchBar.svelte";
  import { enhance } from "$app/forms";
  import { notification } from "$lib/stores";
  import CreateButton from "$lib/components/UI/CreateButton.svelte";
  import Search from "$lib/components/UI/Search.svelte";

  export let data: PageServerData;

  let formulae: Formula[] = data.formulae;
</script>

<MetaData title="BCF | Formulate" />

<AppWrap>
  <SearchBar>
    <Search placeholder="/ search formulas" />
    <form
      method="post"
      action="?/create"
      use:enhance={() =>
        notification.set({ message: "Formula Created", type: "Success" })}
    >
      <CreateButton />
    </form>
  </SearchBar>

  <div id="table-wrapper" class="my-8 flex w-full items-center justify-center">
    <div
      id="card-holder"
      class="grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
    >
      {#each formulae as formula}
        <FormulateCard {formula} />
      {/each}
    </div>
  </div>
</AppWrap>
