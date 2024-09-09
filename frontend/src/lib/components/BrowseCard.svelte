<script lang="ts">
  export let ingredient:App.IngredientBrowse;
  import Card from "./Card.svelte";
</script>

<Card header={ingredient.common_name} body={ingredient.cas} href={`/browse/${ingredient.slug}`} />