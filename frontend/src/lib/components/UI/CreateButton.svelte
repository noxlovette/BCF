<script lang="ts">
  import AddCrossIcon from "$lib/icons/AddCrossIcon.svelte";
  export let href: string;
</script>

<a
  {href}
  class="rounded-full border border-gold-900 bg-gold-700 p-2 text-gold-50 shadow transition-colors hover:bg-white hover:text-gold-700 hover:shadow-lg active:shadow-none dark:hover:bg-stone-800"
>
  <AddCrossIcon />
</a>
