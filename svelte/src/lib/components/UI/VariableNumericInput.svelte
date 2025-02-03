<script lang="ts">
  import { getContext } from "svelte";

  export let number = 0;
  export let text = "";
  export let value: any;
  export let max = 1000;
  export let min = 0;
  const editing = getContext("editing");
</script>

{#if $editing}
  <input
    type="number"
    placeholder={text}
    {max}
    {min}
    bind:value
    class="border-none bg-transparent p-0 ring-0 focus:ring-0 xl:text-2xl dark:bg-zinc-800 {$$props.class}"
  />
{:else}
  <p class="{$$props.class} text-base xl:text-2xl">
    {number}
    {text}
  </p>
{/if}
