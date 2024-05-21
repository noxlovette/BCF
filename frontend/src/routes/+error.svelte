<script lang="ts">
    export let status: number;
    export let error: Error;
</script>

<div class="text-stone-800/80 bg-stone-50 dark:text-stone-100/80 dark:bg-stone-900 antialiased min-h-screen w-screen flex flex-col items-center justify-center">
    <div class="min-h-screen w-screen flex items-center justify-center" style="background: url('/assets/bg/bbblurry-main.svg') no-repeat center center fixed; background-size: cover;">
        <div class="mb-auto text-center">
            <div class="py-12 sm:py-8 md:py-12 lg:py-14 xl:py-12 2xl:py-28">
                <div class="flex size-full items-center justify-center max-w-7xl flex-col">
                    {#if error}    
                        <h1 class="text-6xl mb-4">Error {status}: {error.message}</h1>
                    {/if}
                    <a href="https://t.me/noxlovette" class="font-bold rounded-lg text-6xl text-center">Nothing is perfect, something went wrong. Please complain by clicking on this message. Panic helps!</a>
                </div>
            </div>
        </div>
    </div>
</div>
