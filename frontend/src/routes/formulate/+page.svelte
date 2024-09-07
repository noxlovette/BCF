<script lang="ts">
  import { onMount } from "svelte";
  import { notification } from "$lib/stores/notificationStore";
  import { goto } from "$app/navigation";
    import MetaData from "$lib/components/MetaData.svelte";
    import type { PageData } from "../$types";
    import FormulateCard from "$lib/components/FormulateCard.svelte";

    export let data: PageData;

  let formulae:App.Formula[] = data.formulae;

  onMount(async () => {
    let is_authenticated = sessionStorage.getItem("is_authenticated");
    if (is_authenticated === "false" || is_authenticated === null) {
      await goto("/auth/login");
      notification.set({
        message: "Please log in to access this page",
        type: "error",
      });
    }
  });
</script>

<MetaData title="BCF | Formulate" />
<div id="app" class="my-8 flex flex-col items-center lowercase caret-grapefruit-700">
<div class="flex h-full items-center justify-center md:hidden">
  <h1 class="text-xl font-bold">this page is desktop only :(</h1>
</div>


<div
    id="table-wrapper"
    class="ml-6 mr-6 mt-0 flex h-full flex-row items-center overflow-x-auto overflow-y-auto p-2 text-sm"
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
</div>

<style>
  .active {
    @apply bg-aqua-600;
    @apply dark:bg-aqua-800/40;
    @apply dark:text-aqua-100/80;
    @apply shadow-inner;
  }
</style>
