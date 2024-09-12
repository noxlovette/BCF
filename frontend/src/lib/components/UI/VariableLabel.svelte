<script lang="ts">
import { getContext } from "svelte";
    import Label from "./Label.svelte";

export let text = 'Hello World!';
export let value:any;
const editing = getContext("editing");


</script>
{#if $editing}
  <input type="text" bind:value={value} class="dark:bg-stone-800 text-sm opacity-60 bg-transparent focus:ring-0 p-0 border-none ring-0" />
{:else}
  <Label>
    {text}
  </Label>
{/if}
