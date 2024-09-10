<script lang="ts">
    import type { PageServerData } from "../$types";

    export let data: PageServerData;
    console.log(data);
    import CollectCard from "$lib/components/CollectCard.svelte";
    let collection = data.collection;

</script>
{#each collection as ingredient}
          {#if ingredient}
            <CollectCard {ingredient} />
        {/if}
{/each}