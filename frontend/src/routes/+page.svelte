<script lang="ts">
  import { onMount } from "svelte";
  import BigText from "$lib/components/BigText.svelte";
  import { fade } from "svelte/transition";

  const bigText = `Want to create your own <span class="text-amber-300"> perfume? </span>We've got you covered<span class="text-amber-300">.</span>`;
  let isMounted = false;

  onMount(() => {
    isMounted = true;
  });
</script>

<svelte:head>
  <title>BCF</title>
</svelte:head>
<div class="min-h-screen w-screen" style="">
  <div
    class="flex flex-col items-center justify-center py-12 sm:py-8 md:py-12 2xl:py-28"
  >
    <BigText text={bigText} />

    <div
      id="blabla"
      class="my-8 flex max-w-md flex-col items-center justify-center py-4 sm:max-w-2xl md:max-w-3xl md:py-8 lg:max-w-4xl xl:max-w-5xl 2xl:py-16"
      in:fade={{ duration: 300, delay: 300 }}
    >
      <section
        id="browse"
        class="mx-auto grid aspect-[16/9] h-[600px] w-[325px] grid-cols-1 items-center justify-center gap-8 text-pretty rounded-lg bg-cover bg-center px-4 py-8 pb-12 sm:w-[425px] sm:px-6 md:w-full md:py-16 lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-24 xl:gap-x-12"
        style="background-image: url('/assets/img/dalle-browse-4.webp')"
      >
        <div class="hidden lg:col-span-1 lg:block">
          <!-- Empty on large screens to maintain grid layout -->
        </div>
        <div
          class="group flex flex-col items-center justify-center rounded-lg bg-white/70 p-8 text-center backdrop-blur-lg transition-all hover:bg-white hover:shadow-lg lg:p-12 lg:text-left dark:bg-stone-900/70 dark:hover:bg-gray-800"
        >
          <a href="/browse" class="z-10">
            <h2
              class="mb-4 text-3xl font-bold group-hover:text-sky-700 md:text-3xl lg:text-4xl group-hover:dark:text-sky-400"
            >
              Browse over 3100 ingredients.
            </h2>
          </a>
          <p
            class="max-w-2xl group-hover:text-sky-800 md:text-lg lg:text-xl xl:text-2xl group-hover:dark:text-sky-200"
          >
            Use the power of IFRA's FIG in an unprecedented way. Industry-level
            data, supported by the opinions of real perfumers. This is the place
            where the hidden becomes apparent, and your expertise grows. <b
              >You contribute</b
            >, and you <b>benefit</b>.
          </p>
        </div>
      </section>

      <section
        id="browse"
        class="mx-auto my-12 grid aspect-[16/9] h-[600px] w-[325px] grid-cols-1 items-center gap-8 text-pretty rounded-lg bg-cover bg-center px-4 py-8 pb-12 sm:w-[425px] sm:px-6 md:w-full md:py-16 lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-24 xl:gap-x-12"
        style="background-image: url('/assets/img/dalle-collect-1.webp')"
      >
        <div
          class="group group flex flex-col items-center justify-center rounded-lg bg-white/70 p-8 text-center backdrop-blur-lg transition-all hover:bg-white hover:shadow-lg lg:p-12 lg:text-right dark:bg-stone-900/70 dark:hover:bg-stone-800"
        >
          <a href="/collect">
            <h2
              class="mb-4 text-3xl font-bold group-hover:text-rose-700 md:text-3xl lg:text-4xl group-hover:dark:text-rose-400"
            >
              Collect hundreds of compounds.
            </h2>
          </a>
          <p
            class="max-w-2xl group-hover:text-rose-800 md:text-lg lg:text-xl xl:text-2xl group-hover:dark:text-rose-200"
          >
            Keep track of your favourite ingredients and the ones you want to
            try. Note down ideas, associations, and inspirations. Everything
            from colour to availability in your lab. Your collection is your
            world only. <b>Encrypted, it is only yours to enjoy.</b>
          </p>
        </div>
        <div class="hidden lg:col-span-1 lg:block">
          <!-- Empty on large screens to maintain grid layout -->
        </div>
      </section>

      <section
        id="formulate"
        class="mx-auto my-12 grid aspect-[16/9] h-[600px] w-[325px] grid-cols-1 items-center gap-8 text-pretty rounded-lg bg-cover bg-center px-4 py-8 pb-12 sm:w-[425px] sm:px-6 md:w-full md:py-16 lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-24 xl:gap-x-12"
        style="background-image: url('/assets/img/dalle-formulate-1.webp')"
      >
        <div
          class="group flex flex-col items-center justify-center rounded-lg bg-white/70 p-8 text-center backdrop-blur-lg transition-all hover:bg-white hover:shadow-lg lg:p-12 lg:text-right dark:bg-stone-900/70 dark:hover:bg-neutral-800"
        >
          <a href="/formulate">
            <h2
              class="mb-4 w-full text-3xl font-bold group-hover:text-lime-700 md:text-3xl lg:text-4xl group-hover:dark:text-lime-400"
            >
              Formulate a revolution.
            </h2>
          </a>
          <p
            class="max-w-2xl group-hover:text-lime-800 md:text-lg lg:text-xl xl:text-2xl group-hover:dark:text-lime-200"
          >
            Manage your formulas independent of where you are. At home, in the
            lab, or on holiday. Focus on how to make your ideas come true, and
            not on where to store them. Make a difference. <b>Change</b> the
            landscape of <b> perfumery today.</b>
          </p>
        </div>
        <div class="hidden lg:col-span-1 lg:block">
          <!-- Empty on large screens to maintain grid layout -->
        </div>
      </section>
    </div>
    <div class="lg:px-8 lg:py-8">
      <div class="flex flex-col items-center">
        <div class="mx-auto max-w-[800px] xl:max-w-7xl">
          <div
            class="2xl:max-w-6x1 max-w-md px-4 sm:max-w-2xl sm:px-6 md:max-w-3xl lg:max-w-4xl lg:px-0 xl:max-w-5xl"
          >
            <div class="flex w-full flex-col items-center gap-4">
              <div class="flex flex-col items-start justify-between">
                <div
                  id="buttons"
                  class="flex flex-col text-pretty text-center text-6xl font-bold tracking-tight xl:text-[6rem] xl:tracking-tight 2xl:text-[6.5rem]"
                  style="width: 100%;"
                  in:fade={{ duration: 500, delay: 2500 }}
                >
                  <div class="flex flex-col xl:flex-row">
                    <a
                      href="/browse"
                      class="button px-6 py-3 transition-all hover:text-sky-700"
                      >browse</a
                    >
                    <a
                      href="/collect"
                      class="button px-6 py-3 transition-all hover:text-pink-700"
                      >collect</a
                    >
                    <a
                      href="/formulate"
                      class="button px-6 py-3 transition-all hover:text-lime-700"
                      >formulate</a
                    >
                  </div>
                  <a
                    href="/auth/signup"
                    class="button px-6 py-3 text-amber-300 transition-all hover:text-current"
                    >sign up</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
</style>
