<script lang="ts">
  export let text: string;
</script>


  <div class="flex flex-col items-start">
      <div
        class="max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl-0 xl:max-w-5xl"
      >
        <div class="flex w-full flex-col items-center">

            <h1
              class="text-pretty text-left text-6xl font-bold tracking-tight xl:text-[6rem] xl:tracking-tight 2xl:text-[6.5rem]
              {$$props.class}"
            >
              {@html text}
            </h1>
          </div>
      </div>
    </div>
