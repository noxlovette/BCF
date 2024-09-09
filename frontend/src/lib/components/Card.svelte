<script lang="ts">
    export let header:string;
    export let body:string;
    export let href:string;
  </script>
  
  <a
    id="card-small"
    class="group flex p-4 flex-col rounded-lg bg-white space-y-2 text-left font-space shadow-lg transition-all hover:scale-105 hover:bg-gold-700 hover:text-gold-50 hover:shadow-lg dark:bg-stone-800 dark:border-gold-900 border items-start justify-between"
    href="{href}"
    tabindex="0"
  >
  
  <h1
        class="hyphens-auto text-2xl tracking-tighter text-gold-800 group-hover:text-gold-50"
      >
        {header}
      </h1>
      <p
        class="min-w-fit text-clip opacity-60 group-hover:text-gold-200/60"
      >
        {body}
    </p>
  </a>
  
  