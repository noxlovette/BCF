<script lang="ts">
  export let header: string;
  export let body: string;
  export let href: string;
</script>

<a
  id="card-small"
  class="font- group flex flex-col items-start justify-between space-y-2 overflow-clip rounded border border-gold-400 bg-stone-50 p-4 text-left font-quicksand shadow transition-all hover:scale-105 hover:bg-gold-700 hover:text-gold-50 hover:shadow-lg dark:border-gold-900 dark:bg-stone-800 dark:hover:bg-gold-800
{$$props.class} {body === '0000-00-0' ? 'bg-peach-400' : ''} {header ===
  'New Formula'
    ? 'bg-peach-400'
    : ''}
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
