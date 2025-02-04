<script lang="ts">
  let { styling = "", colour = "navy", children } = $props();
</script>

<button
  type="submit"
  class="{styling} bg-{colour}-600 hover:bg-{colour}-700 text-{colour}-50 focus:ring-{colour}-500 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors duration-200 focus:ring-2"
>
  {@render children()}
</button>
