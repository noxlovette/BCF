<script lang="ts">
  import { getContext } from "svelte";

  export let text = "Hello World!";
  export let value: any;
  export let name = "";
  const editing = getContext("editing");
</script>

{#if $editing}
  <input
    type="text"
    {name}
    bind:value
    placeholder={text}
    class="rounded border-none border-zinc-500 bg-transparent p-0 ring-0 focus:border-zinc-500 focus:ring-0 dark:bg-zinc-800
  {$$props.class}
  "
  />
{:else}
  <p class="{$$props.class}  ">
    {text}
  </p>
{/if}
