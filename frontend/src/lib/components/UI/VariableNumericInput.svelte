<script lang="ts">
  import { getContext } from "svelte";

  export let number = 0;
  export let text = "";
  export let value: any;
  const editing = getContext("editing");
</script>

{#if $editing}
  <input
    type="number"
    bind:value
    class="border-none bg-transparent p-0 font-medium ring-0 focus:ring-0 xl:text-2xl dark:bg-stone-800 {$$props.class}"
  />
{:else}
  <p class="{$$props.class} text-base font-medium xl:text-2xl">
    {number}
    {text}
  </p>
{/if}
