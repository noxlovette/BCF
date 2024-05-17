<script lang="ts">
    export let status: number;
    export let error: Error;
</script>

<div class="flex size-full items-center max-w-7xl">
    {#if error}
        <h1 class="text-6xl">Error {status}: {error.message}</h1>
    {:else}
        <h1 class="text-6xl">Page Loaded Successfully</h1>
    {/if}
    <a href="t.me/noxlovette">text me and say what happened</a>
</div>