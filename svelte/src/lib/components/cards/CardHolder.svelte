<script lang="ts">
  import { quintOut } from "svelte/easing";
  import { fade } from "svelte/transition";

  let { children } = $props();
</script>

<div
  id="card-holder"
  class="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  transition:fade={{ duration: 200, easing: quintOut }}
>
  {@render children()}
</div>
