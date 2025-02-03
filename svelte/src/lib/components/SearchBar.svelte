<script lang="ts">
  import { fade } from "svelte/transition";
  let { children } = $props();
</script>

<div
  id="search-bar"
  class="group flex w-full flex-col justify-between gap-4 rounded-lg bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg sm:flex-row sm:items-center dark:bg-zinc-900"
  in:fade
>
  {@render children()}
</div>
