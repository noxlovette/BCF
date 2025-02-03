<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch("click");
  }
</script>

<button
  on:mousedown={handleClick}
  class="border-gold-400 bg-gold-700 text-gold-50 hover:text-gold-700 dark:border-gold-900 rounded-full border p-2 shadow transition-colors hover:bg-white hover:shadow-lg active:shadow-none dark:hover:bg-zinc-800
  {$$props.class}
  
  "
>
  <slot />
</button>
