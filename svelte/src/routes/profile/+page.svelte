<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import Settings from "./Settings.svelte";
  import Contributions from "./Contributions.svelte";
  import type { PageServerData } from "./$types";

  import { user } from "$lib/stores";
  import AppWrap from "$lib/components/AppWrap.svelte";
  import BigText from "$lib/components/typography/BigText.svelte";

  export let data: PageServerData;

  const suggestedIngredients = data.suggestedIngredients;
  let currentPage = writable("");
  let greeting = writable("");

  onMount(async () => {
    updateGreeting();
  });

  function updateGreeting() {
    const hours = new Date().getHours();
    if (hours < 12) {
      greeting.set("morning");
    } else if (hours < 18) {
      greeting.set("afternoon");
    } else {
      greeting.set("evening");
    }
  }
</script>

<svelte:head>
  <title>BCF | Profile</title>
</svelte:head>
<AppWrap>
  <div
    id="header"
    class="flex w-full flex-row items-end justify-between border-b-2 border-zinc-500 pb-4 xl:border-b-4"
  >
    <button
      class="font-quicksand text-7xl"
      on:click={() => currentPage.set("")}
    >
      Good <span class="text-gold-400">{$greeting}</span>
    </button>

    <div id="controls" class="flex flex-row justify-end space-x-4 xl:text-2xl">
      <button
        class="rounded border-2 border-zinc-500 px-6 py-2"
        on:mousedown={() => currentPage.set("settings")}
      >
        Settings
      </button>
      <button
        class="rounded border-2 border-zinc-500 px-6 py-2"
        on:mousedown={() => currentPage.set("contributions")}
      >
        Contributions
      </button>
      <form method="post" action="?/logout">
        <button
          type="submit"
          class="rounded border-2 border-zinc-500 px-6 py-2"
        >
          Log Out
        </button>
      </form>
    </div>
  </div>

  {#if $currentPage === "settings"}
    <Settings />
  {:else if $currentPage === "contributions"}
    <Contributions {suggestedIngredients} />
  {/if}
</AppWrap>
