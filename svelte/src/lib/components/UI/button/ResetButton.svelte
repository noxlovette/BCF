<script lang="ts">
  import { ListRestart } from "lucide-svelte";
</script>

<button
  formaction="?/reset"
  class="border-saffron-400 bg-saffron-700 text-saffron-50 hover:text-saffron-700 dark:border-saffron-900 rounded-full border p-2 shadow transition-colors hover:bg-white hover:shadow-lg active:shadow-none dark:hover:bg-stone-800"
>
  <ListRestart />
</button>
