<script lang="ts">
    import Card from "./Card.svelte";

  export let formula:App.Formula;

</script>

<Card header={formula.name} body={formula.description} href={`/formulate/${formula.uuid}`} />