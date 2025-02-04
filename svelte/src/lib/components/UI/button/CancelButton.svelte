<script lang="ts">
  let { styling = "" } = $props();
</script>

<a
  href="."
  class="{styling} rounded-md border border-stone-300 px-4 py-2 text-sm
  font-medium text-stone-700 shadow-sm transition-colors duration-200
  hover:bg-stone-100 focus:ring-2 focus:ring-stone-500"
>
  Cancel
</a>
