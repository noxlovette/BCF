<script lang="ts">
  import type { IngredientBrowse } from "$lib/types";
  let { ingredient }: { ingredient: IngredientBrowse } = $props();
  import Card from "./Card.svelte";

  $inspect(ingredient.descriptors);
</script>

<Card
  header={ingredient.commonName}
  descriptors={ingredient.descriptors}
  body={ingredient.cas}
  href={`/browse/${ingredient.slug}`}
/>
