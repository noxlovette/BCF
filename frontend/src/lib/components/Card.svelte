<script lang="ts">
  export let header: string;
  export let body: string;
  export let href: string;
</script>

<a
  id="card-small"
  class="group flex flex-col items-start justify-between space-y-2 overflow-clip rounded-lg border bg-white p-4 text-left font-space shadow-lg transition-all hover:scale-105 hover:bg-gold-700 hover:text-gold-50 hover:shadow-lg dark:border-gold-900 dark:bg-stone-800"
  {href}
  tabindex="0"
>
  <h1
    class="hyphens-auto text-2xl tracking-tighter text-gold-800 group-hover:text-gold-50"
  >
    {header}
  </h1>
  <p class="min-w-fit text-clip opacity-60 group-hover:text-gold-200/60">
    {body}
  </p>
</a>
