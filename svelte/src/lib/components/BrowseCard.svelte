<script lang="ts">
  import type { IngredientBrowse } from "$lib/types";
  export let ingredient: IngredientBrowse;
  import Card from "./Card.svelte";
</script>

<Card
  header={ingredient.common_name}
  body={ingredient.cas}
  href={`/browse/${ingredient.slug}`}
/>
