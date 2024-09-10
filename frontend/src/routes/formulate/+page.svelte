<script lang="ts">
  import MetaData from "$lib/components/MetaData.svelte";
  import type { PageServerData } from "../$types";
  import FormulateCard from "$lib/components/FormulateCard.svelte";

    import AppWrap from "$lib/components/AppWrap.svelte";
    import SearchBar from "$lib/components/SearchBar.svelte";

  export let data: PageServerData;

  let formulae: App.Formula[] = data.formulae;
</script>

<MetaData title="BCF | Formulate" />

<AppWrap>
  <SearchBar />
  <div class="flex h-full items-center justify-center md:hidden">
    <h1 class="text-xl font-bold">this page is desktop only :(</h1>
  </div>

  <div
    id="table-wrapper"
    class="flex h-full flex-row items-center overflow-x-auto overflow-y-auto p-2 text-sm"
  >
    <div id="wrapper" class="rounded-lg p-8">
      <div
        id="card-holder"
        class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
      >
        {#each formulae as formula}
          <FormulateCard {formula} />
        {/each}
      </div>
    </div>
  </div>
</AppWrap>

