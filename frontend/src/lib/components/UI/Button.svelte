<script lang="ts">
  export let href = "";
</script>

<a
  {href}
  class="text-center rounded-lg bg-gold-400 border-gold-700 dark:border-gold-900 p-2 text-stone-900 shadow transition-all hover:bg-stone-50 hover:text-gold-400 dark:hover:bg-stone-700
{$$props.class}"
  >
  <slot></slot>
</a>
