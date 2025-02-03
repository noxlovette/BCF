<script lang="ts">
  import { fade } from "svelte/transition";

  let {
    header = "Card",
    body = "Very Gute Karte!",
    href = ".",
    style = "",
  } = $props();
</script>

<a
  id="card-small"
  {href}
  class="group hover:ring-gold-400 flex flex-col justify-between rounded-lg
bg-stone-50 p-5 ring-2
         shadow-sm ring-stone-200 transition-all duration-300 hover:scale-102
         hover:shadow-md dark:bg-stone-900 dark:ring-stone-900"
  tabindex="0"
  {style}
  transition:fade
>
  <h2
    class="text-gold-800 mb-2 text-xl font-semibold
           tracking-tight"
  >
    {header}
  </h2>

  <p class="text-sm opacity-80">
    {body}
  </p>
</a>
