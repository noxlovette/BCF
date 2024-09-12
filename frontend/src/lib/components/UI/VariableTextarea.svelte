<script lang="ts">
import { getContext } from "svelte";
export let text:string = 'Hello World!';
export let value:any;

const editing = getContext("editing");


</script>
{#if $editing}
  <textarea rows="10" bind:value={value} class="dark:bg-stone-800 resize-none w-full bg-transparent font-medium xl:text-2xl focus:ring-0 p-0 border-none xl:text-2xlring-0" />
{:else}
  <p class="{$$props.class} font-medium xl:text-2xl">
    {text}
  </p>
{/if}
