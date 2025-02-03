<script lang="ts">
  let { text = "SOMEBODY SOMEONE", styling = "" } = $props();
</script>

<div class="my-8 flex flex-col items-start">
  <div class="lg:max-w-4xl-0 max-w-md sm:max-w-2xl md:max-w-3xl xl:max-w-6xl">
    <div class="flex w-full flex-col items-center">
      <h1
        class="font-manrope text-center text-6xl font-bold tracking-tighter text-pretty xl:text-[6rem] xl:tracking-tight 2xl:text-[6.5rem]
              {styling}
              "
      >
        {@html text}
      </h1>
    </div>
  </div>
</div>
