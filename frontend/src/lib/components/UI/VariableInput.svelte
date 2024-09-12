<script lang="ts">
  import { getContext } from "svelte";

  export let text = "Hello World!";
  export let value: any;
  const editing = getContext("editing");
</script>

{#if $editing}
  <input
    type="text"
    bind:value
    placeholder={text}
    class="rounded border-none border-stone-500 bg-transparent p-0 ring-0 focus:border-stone-500 focus:ring-0 dark:bg-stone-800
  {$$props.class}
  "
  />
{:else}
  <p class="{$$props.class}  ">
    {text}
  </p>
{/if}
