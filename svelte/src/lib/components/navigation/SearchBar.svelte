<script lang="ts">
  let { children, colour = "saffron" } = $props();
</script>

<div
  id="search-bar"
  class="group flex w-full flex-col justify-between rounded-b-lg border-t-2 bg-white px-3 py-4 border-{colour}-600
   shadow-md transition-all duration-300 hover:shadow-lg sm:flex-row sm:items-center dark:bg-stone-900"
>
  {@render children()}
</div>

<!-- These will ensure that all border stylings are prerendered compile-time-->
<input type="hidden" class="border-ultra-600" />
<input type="hidden" class="border-saffron-600" />
<input type="hidden" class="border-wine-600" />
<input type="hidden" class="border-hunter-600" />
