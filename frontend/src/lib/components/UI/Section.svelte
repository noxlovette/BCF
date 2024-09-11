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

<section id={href} class="w-full text-pretty rounded">
  <div
    class="group flex flex-col rounded bg-white/70 p-4 backdrop-blur-lg transition-all hover:bg-white hover:shadow-lg lg:p-8 dark:bg-stone-900/70 dark:hover:bg-stone-800"
  >
    <a href="/{href}" class="">
      <h2
        class={`mb-4 text-3xl font-bold transition-colors md:text-3xl lg:text-4xl ${colorClasses[color] || colorClasses.navy}`}
      >
        {heading}
      </h2>
    </a>
    <p
      class={`max-w-2xl transition-colors md:text-lg lg:text-xl xl:text-2xl ${colorClasses[color] || colorClasses.navy}`}
    >
      {body}
    </p>
  </div>
</section>
