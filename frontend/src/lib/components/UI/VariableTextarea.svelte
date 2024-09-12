<script lang="ts">
  import { getContext } from "svelte";
  export let text: string = "Hello World!";
  export let value: any;

  const editing = getContext("editing");
</script>

{#if $editing}
  <textarea
    rows="10"
    bind:value
    class="xl:text-2xlring-0 w-full resize-none border-none bg-transparent p-0 font-medium focus:ring-0 xl:text-2xl dark:bg-stone-800"
  />
{:else}
  <p class={$$props.class}>
    {text}
  </p>
{/if}
