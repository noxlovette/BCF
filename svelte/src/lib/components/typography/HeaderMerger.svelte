<script lang="ts">
  import { H1 } from "$lib/components";
  let { children, colour = "gold" } = $props();
</script>

<div
  class="border-{colour}-500 mb-4 flex w-full flex-col items-center rounded-b-lg py-2 xl:border-t-2 dark:bg-stone-900"
>
  <H1>
    {@render children()}
  </H1>
</div>
