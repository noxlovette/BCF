<script lang="ts">
  export let href = "";
</script>

<a
  {href}
  class="border-gold-700 bg-gold-400 hover:text-gold-400 dark:border-gold-900 rounded p-2 text-center text-stone-900 shadow transition-all hover:bg-stone-50 dark:hover:bg-stone-700
{$$props.class}"
>
  <slot></slot>
</a>
