<script lang="ts">
  import type { IngredientCollection } from "$lib/types";
  import Card from "./Card.svelte";

  export let ingredient: IngredientCollection;
</script>

<Card
  header={ingredient.common_name}
  body={ingredient.cas}
  href={`/collect/${ingredient.id}`}
/>
