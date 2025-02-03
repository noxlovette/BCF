<script lang="ts">
  export let header: string;
  export let body: string;
  export let href: string;
</script>

<a
  id="card-small"
  class="font- group border-gold-400 font-quicksand hover:bg-gold-700 hover:text-gold-50 dark:border-gold-900 dark:hover:bg-gold-800 flex flex-col items-start justify-between space-y-2 overflow-clip rounded border bg-stone-50 p-4 text-left shadow transition-all hover:scale-105 hover:shadow-lg dark:bg-stone-800
{$$props.class} {body === '0000-00-0' ? 'bg-peach-400' : ''} {header ===
  'New Formula'
    ? 'bg-peach-400'
    : ''}
  "
  {href}
  tabindex="0"
>
  <h1
    class="text-gold-800 group-hover:text-gold-50 text-2xl tracking-tighter hyphens-auto"
  >
    {header}
  </h1>
  <p class="group-hover:text-gold-50 min-w-fit text-clip opacity-60">
    {body}
  </p>
</a>
