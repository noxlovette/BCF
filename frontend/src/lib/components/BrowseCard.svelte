<script lang="ts">
    export let ingredient: any = {};
    let isExpanded = false;
</script>

<div id="card-small" class="p-8 rounded-lg shadow-md bg-white min-h-[160px] transition-all group hover:scale-105 hover:text-sky-50 hover:bg-sky-800 hover:shadow-lg"
on:click={() => isExpanded = !isExpanded}
role="button"
tabindex="0"
on:keydown={(event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        isExpanded = !isExpanded;
    }
}}
>
    <div id="top-part" class="flex flex-row items-baseline">
        <h1 class="text-3xl tracking-tighter font-bold truncate text-sky-800 mr-8 group-hover:text-sky-50">{ingredient.common_name}</h1>
        <h2 class="ml-auto text-clip opacity-60 min-w-fit group-hover:text-sky-200/60">{ingredient.cas}</h2>
    </div>
    <div id="left-side" class="w-5/6 mt-4">
    <p class="text-clip mr-8">
        {#if ingredient.use}    
        {ingredient.use}
        {:else}
        know how to use this? Submit a suggestion!
        {/if}
    </p>
    <h2 class="mt-[56px] opacity-60 group-hover:text-sky-200/60">{ingredient.descriptors}</h2>
</div>
</div>