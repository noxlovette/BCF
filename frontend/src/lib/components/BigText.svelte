<script lang="ts">
  export let text: string;
</script>

<div class="lg:px-8">
  <div class="flex flex-col items-center">
    <div class="mx-auto max-w-[800px] xl:max-w-7xl">
      <div
        class="max-w-md px-4 sm:max-w-2xl sm:px-6 md:max-w-3xl lg:max-w-4xl lg:px-0 xl:max-w-5xl 2xl:max-w-6xl"
      >
        <div class="flex w-full flex-col items-center gap-4">
          <div class="flex flex-col items-start justify-between">
            <h1
              class="text-pretty text-left text-6xl font-bold tracking-tight xl:text-[6rem] xl:tracking-tight 2xl:text-[6.5rem]
              {$$props.class}"
            >
              {@html text}
            </h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
