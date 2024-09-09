<script lang="ts">
    import Card from "./Card.svelte";

  export let ingredient:App.IngredientCollection;
</script>

<Card header={ingredient.common_name} body={ingredient.cas} href={`/collect/${ingredient.uuid}`} />