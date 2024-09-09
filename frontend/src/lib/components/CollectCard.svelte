<script lang="ts">
  export let ingredient:App.IngredientCollection;
</script>

<a
  id="card-small"
  class="group flex flex-col w-full rounded-lg space-y-2 justify-between bg-white p-4 text-left shadow-lg transition-all hover:scale-105 hover:bg-grapefruit-700 hover:text-grapefruit-50 hover:shadow-lg dark:bg-stone-800"
  href="/collect/{ingredient.uuid}"
>
    <h1
      class="hyphens-auto text-2xl tracking-tighter text-grapefruit-800 group-hover:text-grapefruit-50"
    >
      {ingredient.common_name}
    </h1>
    <h2
      class="min-w-fit text-clip opacity-60 group-hover:text-grapefruit-200/60"
    >
      {ingredient.cas}
    </h2>

</a>
