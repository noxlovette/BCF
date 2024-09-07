<script lang="ts">
  export let formula:App.Formula;



</script>

<a
  id="card-small-formula"
  href="/formulate/{formula.uuid}"

  class="group flex flex-col rounded-lg items-start justify-between bg-white p-4 md:p-8 text-left shadow-lg transition-all hover:scale-105 hover:bg-aqua-700 hover:text-aqua-50 hover:shadow-lg dark:bg-stone-800"
  tabindex="0"
>
  <div id="top-part" class="flex flex-row items-baseline justify-between w-full">
    <h1
      id="top-left"
      class="mr-8 hyphens-auto text-3xl overflow-clip font-bold tracking-tighter text-aqua-800 group-hover:text-aqua-50"
    >
      {formula.name}
    </h1>

  </div>
  <div id="bottom-part" class="mt-2 md:mt-4 flex flex-row justify-between w-full">
    <div id="bottom-left" class="flex w-2/3 flex-col">
      <p class="hidden md:flex md:mr-8 h-[100px] text-left normal-case overflow-clip">
        {formula.description}
      </p>
      <h2
        class="justify-start mt-auto lowercase opacity-60 group-hover:text-aqua-200/60"
      >
        {formula.ingredients.length} ingredients
      </h2>
    </div>

  </div>
</a>
