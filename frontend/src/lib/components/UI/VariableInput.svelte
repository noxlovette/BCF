<script lang="ts">
import { getContext } from "svelte";

export let text = 'Hello World!';
const editing = getContext("editing");


</script>
{#if $editing}
  <input type="text" bind:value={text} />
{:else}
  <p class="{$$props.class} font-medium xl:text-2xl">
    {text}
  </p>
{/if}
