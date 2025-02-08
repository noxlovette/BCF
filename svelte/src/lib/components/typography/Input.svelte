<script lang="ts">
  let {
    placeholder = "Edit here",
    name = "name",
    value = $bindable(),
    colour = "saffron",
    type = "text",
  }: {
    placeholder: string;
    name: string;
    value: string | number;
    colour?: "wine" | "ultra" | "hunter" | "saffron";
    type?: "text" | "number" | "textarea" | "password" | "email";
  } = $props();

  const styling =
    "mt-2 w-full rounded-md p-3 text-lg shadow-sm dark:border-stone-700 dark:bg-stone-900";
</script>

{#if type === "text"}
  <input
    {name}
    type="text"
    {value}
    class="{styling} focus:border-{colour}-500 focus:ring-{colour}-500"
    {placeholder}
  />
{:else if type === "textarea"}
  <textarea
    {name}
    {value}
    rows="5"
    class="{styling} focus:border-{colour}-500 focus:ring-{colour}-500"
    {placeholder}
  ></textarea>
{:else if type === "number"}
  <input
    type="number"
    {placeholder}
    {name}
    value={value as number}
    class="{styling} focus:border-{colour}-500 focus:ring-{colour}-500"
  />
{:else if type === "password"}
  <input
    type="password"
    {placeholder}
    {name}
    value={value as number}
    class="{styling} focus:border-{colour}-500 focus:ring-{colour}-500"
  />
{:else if type === "email"}
  <input
    type="email"
    {placeholder}
    {name}
    value={value as number}
    class="{styling} focus:border-{colour}-500 focus:ring-{colour}-500"
  />
{/if}

<!-- These will ensure that all stylings are prerendered compile-time-->
<input type="hidden" class=" focus:ring-ultra-500 focus:border-ultra-500" />
<input type="hidden" class=" focus:ring-saffron-500 focus:border-saffron-500" />
<input type="hidden" class=" focus:ring-wine-500 focus:border-wine-500" />
<input type="hidden" class="focus:ring-hunter-500 focus:border-hunter-500" />
