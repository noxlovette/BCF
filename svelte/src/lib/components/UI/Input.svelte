<script lang="ts">
  export let label = "";
  export let name = "";
  export let value = "";
</script>

<div class="flex w-full flex-col">
  <label
    class="text-gold-700/80 dark:text-gold-200/80 block text-left"
    for={label.toLowerCase().replace(/\s+/g, "-")}
  >
    {label}
  </label>

  <input
    id={label.toLowerCase().replace(/\s+/g, "-")}
    name={name.toLowerCase().replace(/\s+/g, "-")}
    class="
    border-gold-400 focus:border-gold-400 focus:ring-gold-400/70 dark:border-gold-900 dark:focus:border-gold-400 dark:focus:ring-gold-400/70 rounded border shadow-sm focus:ring-2 dark:bg-stone-800
		{$$props.class}"
    bind:value
  />
</div>
