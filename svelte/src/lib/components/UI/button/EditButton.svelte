<script lang="ts">
  let { styling = "", colour = "ultra", children, href = "." } = $props();
</script>

<a
  {href}
  class="{styling} bg-{colour}-600 hover:bg-{colour}-700 text-{colour}-50 focus:ring-{colour}-500 rounded-md px-3 py-2 font-medium shadow-sm transition-colors duration-200 focus:ring-2"
>
  {@render children()}
</a>
