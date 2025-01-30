<script lang="ts">
  import Card from "./Card.svelte";
  import type { Formula } from "$lib/types";

  export let formula: Formula;
</script>

<Card
  header={formula.name}
  body={formula.description}
  href={`/formulate/${formula.id}`}
/>
