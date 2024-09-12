<script lang="ts">
import { getContext } from "svelte";

export let number = 0;
export let text= '';
export let value:any;
const editing = getContext("editing");


</script>
{#if $editing}
  <input type="number" bind:value={value} class="dark:bg-stone-800 font-medium bg-transparent focus:ring-0 p-0  border-none xl:text-2xl ring-0 {$$props.class}" />
{:else}
  <p class="{$$props.class} font-medium text-base xl:text-2xl">
    {number} {text}
  </p>
{/if}
