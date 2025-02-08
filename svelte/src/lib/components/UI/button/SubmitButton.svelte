<script lang="ts">
  import { Loader } from "lucide-svelte";
  let {
    styling = "",
    colour = "saffron",
    children,
    isSubmitting = $bindable(false),
    disabled = false,
  } = $props();
</script>

<button
  type="submit"
  {disabled}
  class="{styling} bg-{colour}-600 hover:bg-{colour}-700 text-{colour}-50 focus:ring-{colour}-500 inline-flex items-center space-x-2 rounded-md px-3 py-2 font-medium shadow-sm transition-colors duration-200 focus:ring-2 disabled:bg-stone-300/50"
>
  {#if isSubmitting}
    <Loader class="size-4 animate-spin" />
    <p>On It...</p>
  {:else}
    {@render children()}
  {/if}
</button>

<!-- These will ensure that all stylings are prerendered compile-time-->
<input
  type="hidden"
  class="bg-ultra-600 hover:bg-ultra-700 text-ultra-50 focus:ring-ultra-500"
/>
<input
  type="hidden"
  class="bg-saffron-600 hover:bg-saffron-700 text-saffron-50 focus:ring-saffron-500"
/>
<input
  type="hidden"
  class="bg-wine-600 hover:bg-wine-700 text-wine-50 focus:ring-wine-500"
/>
<input
  type="hidden"
  class="bg-hunter-600 hover:bg-hunter-700 text-hunter-50 focus:ring-hunter-500"
/>
