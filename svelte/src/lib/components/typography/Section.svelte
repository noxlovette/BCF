<script>
  export let href = "";
  export let color = "navy"; // default color
  export let heading = "";
  export let body = "";

  const colorClasses = {
    grapefruit:
      "group-hover:text-grapefruit-700 group-hover:dark:text-grapefruit-400",
    navy: "group-hover:text-navy-700 group-hover:dark:text-navy-400",
    aqua: "group-hover:text-aqua-700 group-hover:dark:text-aqua-400",
    gold: "group-hover:text-gold-700 group-hover:dark:text-gold-400",
  };
</script>

<section
  id={href}
  class="size-full rounded text-pretty ring ring-2 ring-zinc-400/20"
>
  <div
    class="group flex size-full flex-col rounded bg-white/70 p-4 backdrop-blur-lg transition-all hover:bg-white hover:shadow-lg lg:p-8 dark:bg-zinc-900/70 dark:hover:bg-zinc-800"
  >
    <a href="/{href}" class="">
      <h2
        class={`mb-4 text-3xl font-bold transition-colors md:text-3xl ${colorClasses[color] || colorClasses.navy}`}
      >
        {heading}
      </h2>
    </a>
    <p
      class={`max-w-2xl transition-colors md:text-lg lg:text-xl ${colorClasses[color] || colorClasses.navy}`}
    >
      {body}
    </p>
  </div>
</section>
