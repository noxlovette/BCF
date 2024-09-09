<script lang="ts">
  import { page } from "$app/stores";
</script>

<div class="mb-auto text-center">
  <div class="py-12 sm:py-8 md:py-12 lg:py-14 xl:py-12 2xl:py-28">
    <div class="flex size-full max-w-7xl flex-col items-center justify-center">
      <h1 class="text-6xl">Error {$page.status}: {$page.error.message}</h1>
      <a
        href="https://t.me/noxlovette"
        class="rounded-lg text-center text-6xl font-bold"
        >Nothing is perfect. Please complain by clicking on this message.</a
      >
    </div>
  </div>
</div>
