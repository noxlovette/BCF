<script lang="ts">
  import AppWrap from "$lib/components/AppWrap.svelte";
    import EditFormulate from "$lib/components/EditFormulate.svelte";
  import type { PageServerData } from "./$types";

  export let data: PageServerData;

  const formula = data.formula;

  let editing = false;
  
</script>

<AppWrap>
  <div class="bg-aqua-900 text-aqua-50 p-4 rounded grid grid-cols-4 items-baseline">
  <h1 class="text-6xl font-quicksand">
    {formula.name}
  </h1>
  <block />
  <p>
    {formula.description}
  </p>
  <p>
    {formula.notes}
  </p>

</div>

</AppWrap>

{#if editing}
<EditFormulate {formula} />
{/if}