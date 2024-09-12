<script lang="ts">
  export let href = "";
</script>

<a
  {href}
  class="rounded border-gold-700 bg-gold-400 p-2 text-center text-stone-900 shadow transition-all hover:bg-stone-50 hover:text-gold-400 dark:border-gold-900 dark:hover:bg-stone-700
{$$props.class}"
>
  <slot></slot>
</a>
