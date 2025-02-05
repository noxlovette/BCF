<script lang="ts">
  let { styling = "" } = $props();
</script>

<a
  href="."
  class="{styling} rounded-md border border-stone-300 px-3 py-2
  font-medium text-stone-700 shadow-sm transition-colors duration-200
  hover:bg-stone-100 focus:ring-2 focus:ring-stone-500
  dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-900
  "
>
  Cancel
</a>
