<script lang="ts">
    export let status: number;
    export let error: Error;
</script>

<div class="flex size-full items-center max-w-7xl">
    {#if error}    
        <h1 class="text-6xl">Error {status}: {error.message}</h1>
    {/if}
    <a href="https://t.me/noxlovette" class="flex font-bold rounded-lg text-6xl">Nothing is perfect. Please complain by clicking on this message. Panic helps!</a>
</div>
