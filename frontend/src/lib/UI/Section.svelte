<script>
    export let href = "";
    export let color = "";
    export let heading = "";
    export let body = "";

</script>


<section
        id="{href}"
        class="text-pretty rounded-lg w-full"
      >
        <div
          class="group flex flex-col rounded-lg bg-white/70 p-4 lg:p-8 backdrop-blur-lg transition-all hover:bg-white hover:shadow-lg dark:bg-stone-900/70 dark:hover:bg-stone-800"
        >
          <a href="/{href}" class="">
            <h2
              class="mb-4 text-3xl font-bold group-hover:text-{color}-700 md:text-3xl lg:text-4xl group-hover:dark:text-{color}-400"
            >
              {heading}
            </h2>
          </a>
          <p
            class="max-w-2xl group-hover:text-{color}-800 md:text-lg lg:text-xl xl:text-2xl group-hover:dark:text-{color}-200"
          >
            {body}
          </p>
        </div>
      </section>