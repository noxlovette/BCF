<script lang="ts">
  let { styling = "", children } = $props();
</script>

<button
  type="submit"
  formaction="?/delete"
  class="{styling} rounded-md border border-red-700 bg-red-600 px-3 py-2 font-medium text-red-50 shadow-sm transition-colors duration-200 hover:bg-red-700 focus:ring-2 focus:ring-red-500"
>
  {@render children()}
</button>
