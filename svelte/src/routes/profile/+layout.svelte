<script lang="ts">
  import { getGreeting } from "$lib/utils";

  const greeting = getGreeting();
  let { children } = $props();
</script>

<svelte:head>
  <title>BCF | Profile</title>
</svelte:head>

<div
  id="header"
  class="my-4 flex w-full flex-row items-end justify-between border-b-2 border-stone-500 pb-4 xl:border-b-4"
>
  <a href="/profile" class="font-quicksand text-7xl">
    Good <span class="text-saffron-400">{greeting}</span>
  </a>
</div>
{@render children()}
