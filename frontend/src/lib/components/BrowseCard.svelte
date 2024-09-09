<script lang="ts">
  export let ingredient:App.IngredientBrowse;
</script>

<a
  id="card-small"
  class="group flex p-4 flex-col rounded-lg bg-white space-y-2 text-left shadow-lg transition-all hover:scale-105 hover:bg-navy-700 hover:text-navy-50 hover:shadow-lg dark:bg-stone-800 items-start justify-between"
  href="/browse/{ingredient.slug}"
  tabindex="0"
>

<h1
      class="hyphens-auto text-2xl tracking-tighter text-navy-800 group-hover:text-navy-50"
    >
      {ingredient.common_name}
    </h1>
    <h2
      class="min-w-fit text-clip opacity-60 group-hover:text-navy-200/60"
    >
      {ingredient.cas}
    </h2>
</a>
