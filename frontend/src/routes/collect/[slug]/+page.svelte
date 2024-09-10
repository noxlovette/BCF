<script lang="ts">
  import type { PageServerData } from "./$types";

  export let data: PageServerData;

  const ingredient: App.IngredientCollection = data.ingredient;
</script>

<div>
  <h1>
    {ingredient.common_name}
  </h1>
  <p>
    {ingredient.use}
  </p>
  <p>
    {ingredient.impression}
    {ingredient.colour}
    {ingredient.associations}
  </p>
</div>
