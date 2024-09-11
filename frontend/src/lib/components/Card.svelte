<script lang="ts">
  export let header: string;
  export let body: string;
  export let href: string;
</script>

<a
  id="card-small"
  class="group font-quicksand flex flex-col items-start justify-between space-y-2 overflow-clip rounded-lg border bg-white p-4 text-left font- shadow-lg transition-all hover:scale-105  hover:bg-gold-700 dark:hover:bg-gold-800 hover:text-gold-50 hover:shadow-lg border-gold-400 dark:border-gold-900 dark:bg-stone-800
{$$props.class} {body === "0000-00-0" ? 'bg-peach-400' : ''} {header === "New Formula" ? 'bg-peach-400' : ''}
  "
  {href}
  tabindex="0"
>
  <h1
    class="hyphens-auto text-2xl tracking-tighter text-gold-800 group-hover:text-gold-50"
  >
    {header}
  </h1>
  <p class="min-w-fit text-clip opacity-60 group-hover:text-gold-50">
    {body}
  </p>
</a>
