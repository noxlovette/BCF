<script>
  export let sectionSmallText = "small text in section.svelte";
  export let sectionBigText = "big text in section.svelte";
</script>

<section id="section">
  <div class="mx-auto flex max-w-[800px] flex-col gap-2 md:gap-4 xl:max-w-full">
    <h2 class="mx-auto w-full text-3xl font-bold md:text-5xl lg:text-5xl">
      {@html sectionBigText}
    </h2>
    <p class="mx-auto max-w-3xl md:text-xl lg:text-xl xl:text-xl">
      {@html sectionSmallText}
    </p>
  </div>
</section>
