<script lang="ts">
  let { children, colour = "gold" } = $props();
</script>

<div
  id="search-bar"
  class="group flex w-full flex-col justify-between gap-4 rounded-b-lg border-t-2 bg-white px-4 py-4 border-{colour}-600
  shadow-md transition-all duration-300 hover:shadow-lg sm:flex-row sm:items-center dark:bg-stone-900"
>
  {@render children()}
</div>

<!-- These will ensure that all border stylings are prerendered compile-time-->
<input type="hidden" class="border-navy-600">
<input type="hidden" class="border-gold-600">
<input type="hidden" class="border-peach-600">
<input type="hidden" class="border-aqua-600">