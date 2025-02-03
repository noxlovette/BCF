<script lang="ts">
  import { fade } from "svelte/transition";
  let { children } = $props();
</script>

<div
  id="search-bar"
  class="group flex w-full flex-col justify-between gap-4 rounded-b-lg bg-white px-4 pb-4
  shadow-md transition-all duration-300 hover:shadow-lg sm:flex-row sm:items-center dark:bg-stone-900"
>
  {@render children()}
</div>
