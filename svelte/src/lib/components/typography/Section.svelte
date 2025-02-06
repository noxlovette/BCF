<script>
  export let href = "";
  export let color = "ultra"; // default color
  export let heading = "";
  export let body = "";

  const colorClasses = {
    hunter: "group-hover:text-hunter-700 group-hover:dark:text-hunter-400",
    ultra: "group-hover:text-ultra-700 group-hover:dark:text-ultra-400",
    hunter: "group-hover:text-hunter-700 group-hover:dark:text-hunter-400",
    saffron: "group-hover:text-saffron-700 group-hover:dark:text-saffron-400",
  };
</script>

<section
  id={href}
  class="size-full rounded text-pretty ring ring-2 ring-stone-400/20"
>
  <div
    class="group flex size-full flex-col rounded bg-white/70 p-4 backdrop-blur-lg transition-all hover:bg-white hover:shadow-lg lg:p-8 dark:bg-stone-900/70 dark:hover:bg-stone-800"
  >
    <a href="/{href}" class="">
      <h2
        class={`mb-4 text-3xl font-bold transition-colors md:text-3xl ${colorClasses[color] || colorClasses.ultra}`}
      >
        {heading}
      </h2>
    </a>
    <p
      class={`max-w-2xl transition-colors md:text-lg lg:text-xl ${colorClasses[color] || colorClasses.ultra}`}
    >
      {body}
    </p>
  </div>
</section>
