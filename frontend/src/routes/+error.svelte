<script lang="ts">
  export let status: number;
  export let error: Error;
</script>

<div
  class="flex min-h-screen w-screen flex-col items-center justify-center bg-stone-50 text-stone-800/80 antialiased dark:bg-stone-900 dark:text-stone-100/80"
>
  <div
    class="flex min-h-screen w-screen items-center justify-center"
    style="background: url('/assets/bg/bbblurry-main.svg') no-repeat center center fixed; background-size: cover;"
  >
    <div class="mb-auto text-center">
      <div class="py-12 sm:py-8 md:py-12 lg:py-14 xl:py-12 2xl:py-28">
        <div
          class="flex size-full max-w-7xl flex-col items-center justify-center"
        >
          {#if error}
            <h1 class="mb-4 text-6xl">Error {status}: {error.message}</h1>
          {/if}
          <a
            href="https://t.me/noxlovette"
            class="rounded-lg text-center text-6xl font-bold"
            >Nothing is perfect, something went wrong. Please complain by
            clicking on this message. Panic helps!</a
          >
        </div>
      </div>
    </div>
  </div>
</div>
