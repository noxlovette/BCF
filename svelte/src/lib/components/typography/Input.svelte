<script lang="ts">
  let {
    placeholder = "Edit here",
    name = "name",
    value = "Edited",
    colour = "gold",
    type = "text",
  }: {
    placeholder: string;
    name: string;
    value: string | number;
    colour: "peach" | "navy" | "aqua" | "gold";
    type: "text" | "number" | "textarea";
  } = $props();
</script>

{#if type === "text"}
  <input
    {name}
    type="text"
    {value}
    class="focus:border-{colour}-500 focus:ring-{colour}-500 mt-2 w-full rounded-md p-3 text-lg shadow-sm dark:border-stone-700 dark:bg-stone-900"
    {placeholder}
  />
{:else if type === "textarea"}
  <textarea
    {name}
    {value}
    rows="5"
    class="focus:border-{colour}-500 focus:ring-{colour}-500 mt-2 w-full rounded-md p-3 text-lg shadow-sm dark:border-stone-700 dark:bg-stone-900"
    {placeholder}
  ></textarea>
{:else if type === "number"}
  <input
    type="number"
    {placeholder}
    {name}
    {value}
    class="focus:border-{colour}-500 focus:ring-{colour}-500 mt-2 w-full rounded-md p-3 text-lg shadow-sm dark:border-stone-700 dark:bg-stone-900"
  />
{/if}

<!-- These will ensure that all stylings are prerendered compile-time-->
<input type="hidden" class=" focus:ring-navy-500 focus:border-navy-500" />
<input type="hidden" class=" focus:ring-gold-500 focus:border-gold-500" />
<input type="hidden" class=" focus:ring-peach-500 focus:border-peach-500" />
<input type="hidden" class="focus:ring-aqua-500 focus:border-aqua-500" />
