<script lang="ts">
  let { body, colour = "ultra", href, heading } = $props();
</script>

<section
  id={href}
  class="size-full rounded text-pretty ring-2 ring-stone-400/20"
>
  <div
    class="group flex size-full flex-col rounded bg-white/50 p-4 backdrop-blur-lg transition-all hover:bg-white hover:shadow-lg lg:p-8 dark:bg-stone-900/50 dark:hover:bg-stone-900
    
    "
  >
    <a href="/{href}" class="">
      <h2 class="mb-4 text-3xl font-bold transition-colors md:text-3xl">
        {heading}
      </h2>
    </a>
    <p class="max-w-2xl transition-colors md:text-lg lg:text-xl">
      {body}
    </p>
  </div>
</section>
