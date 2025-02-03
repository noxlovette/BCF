<script lang="ts">
  import { getContext } from "svelte";
  import Label from "./Label.svelte";

  export let text = "Hello World!";
  export let value: any;
  const editing = getContext("editing");
</script>

{#if $editing}
  <input
    type="text"
    bind:value
    class="border-none bg-transparent p-0 text-sm opacity-60 ring-0 focus:ring-0 dark:bg-zinc-800"
  />
{:else}
  <Label>
    {text}
  </Label>
{/if}
