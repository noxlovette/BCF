<script lang="ts">
  import type { PageServerData } from "./$types";

  export let data: PageServerData;

  const formula = data.formula;
</script>

<div>
  <h1>
    {formula.name}
  </h1>
  <p>
    {formula.description}
  </p>
</div>
