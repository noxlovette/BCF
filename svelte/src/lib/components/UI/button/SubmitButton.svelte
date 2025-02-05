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
