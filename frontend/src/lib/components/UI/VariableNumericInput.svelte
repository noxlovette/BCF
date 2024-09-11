<script lang="ts">
import { getContext } from "svelte";

export let number = 0;
export let text= '';
const editing = getContext("editing");


</script>
{#if $editing}
  <input type="number" bind:value={number} />
{:else}
  <p class="{$$props.class} font-medium text-base xl:text-2xl">
    {number} {text}
  </p>
{/if}
