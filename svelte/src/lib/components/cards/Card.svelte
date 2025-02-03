<script lang="ts">
  import { fade } from "svelte/transition";

  let {
    header = "Card",
    body = "Very Gut Karte!",
    href = ".",
    style = "",
  } = $props();

  const isSpecial = body === "0000-00-0" || header === "New Formula";
</script>

<a
  id="card-small"
  {href}
  class="group flex flex-col justify-between rounded-lg border-2 p-5
         {isSpecial
    ? 'bg-peach-400 border-peach-500'
    : 'border-gold-400 dark:border-gold-900 bg-zinc-50 dark:bg-zinc-800'}
         hover:bg-gold-700 hover:border-gold-600 hover:text-gold-50 shadow-sm transition-all
         duration-300 hover:scale-102 hover:shadow-md"
  tabindex="0"
  {style}
  transition:fade
>
  <h2
    class="group-hover:text-gold-50 mb-2 text-xl font-semibold tracking-tight
           {isSpecial ? 'text-peach-900' : 'text-gold-800'}"
  >
    {header}
  </h2>

  <p class="group-hover:text-gold-50 text-sm opacity-80 group-hover:opacity-90">
    {body}
  </p>
</a>
