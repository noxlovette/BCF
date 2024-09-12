<script lang="ts">
import { getContext } from "svelte";

export let text = 'Hello World!';
export let value:any;
const editing = getContext("editing");


</script>
{#if $editing}
  <input type="text" bind:value={value} class="dark:bg-stone-800  bg-transparent focus:ring-0 focus:border-stone-500 p-0 border-none rounded border-stone-500 ring-0
  {$$props.class}
  " />
{:else}
  <p class="{$$props.class}  ">
    {text}
  </p>
{/if}
