<script lang="ts">
  import { H1 } from "$lib/components";
  let { children, colour = "saffron" } = $props();
</script>

<div
  class="border-{colour}-600 mb-8 flex w-full flex-col items-center py-2 md:rounded-b-lg xl:border-t-2 dark:bg-stone-900"
>
  <H1>
    {@render children()}
  </H1>
</div>
