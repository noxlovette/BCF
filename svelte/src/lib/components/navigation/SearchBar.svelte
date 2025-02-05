<script lang="ts">
  let { children, colour = "gold" } = $props();
</script>

<div
  id="search-bar"
  class="group flex w-full flex-col justify-between gap-4 rounded-b-lg border-t-2 bg-white px-4 py-4 border-{colour}-500
  shadow-md transition-all duration-300 hover:shadow-lg sm:flex-row sm:items-center dark:bg-stone-900"
>
  {@render children()}
</div>
