<script lang="ts">
  import { Loader } from "lucide-svelte";
  let {
    styling = "",
    colour = "navy",
    children,
    isSubmitting = $bindable(false),
  } = $props();
</script>

<button
  type="submit"
  class="{styling} bg-{colour}-600 hover:bg-{colour}-700 text-{colour}-50 focus:ring-{colour}-500 inline-flex items-center space-x-2 rounded-md px-3 py-2 font-medium shadow-sm transition-colors duration-200 focus:ring-2"
>
  {#if isSubmitting}
    <Loader class="size-4 animate-spin" />
    <p>On It...</p>
  {:else}
    {@render children()}
  {/if}
</button>


<!-- These will ensure that all stylings are prerendered compile-time-->
<input type="hidden" class="bg-navy-600 hover:bg-navy-700 text-navy-50 focus:ring-navy-500">
<input type="hidden" class="bg-gold-600 hover:bg-gold-700 text-gold-50 focus:ring-gold-500">
<input type="hidden" class="bg-peach-600 hover:bg-peach-700 text-peach-50 focus:ring-peach-500">
<input type="hidden" class="bg-aqua-600 hover:bg-aqua-700 text-aqua-50 focus:ring-aqua-500">