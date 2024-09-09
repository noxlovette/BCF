<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;

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
