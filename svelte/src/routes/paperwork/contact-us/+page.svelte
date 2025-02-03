<script>
  import BigText from "$lib/components/typography/BigText.svelte";
</script>

<div class="lowercase">
  <BigText text="Contact Me<span class='text-gold-400'>.</span>" />
</div>

<div
  class="mx-auto flex max-w-4xl flex-col items-center justify-between space-y-4 py-6 lg:mt-4 xl:space-y-8"
>
  <div class="group flex w-[350px] items-center lg:w-[400px]">
    <a
      href="https://t.me/noxlovette"
      class="flex flex-row items-center justify-between"
    >
      <div class="lg:ml-8 xl:ml-12">
        <h2
          class="group-hover:text-gold-400 text-3xl font-bold text-pretty transition-all"
        >
          Telegram
        </h2>
        <p
          class="text-pretty transition-all group-hover:text-stone-800 dark:group-hover:text-stone-300"
        >
          Send feedback, swear, say what you want. I can take it all. Quick
          response, fast results.
        </p>
      </div>
    </a>
  </div>
  <div class="group flex w-[350px] items-center lg:w-[400px]">
    <a
      href="mailto:noxlovette@proton.me"
      class="flex flex-row items-center justify-between"
    >
      <div class="lg:ml-8 xl:ml-12">
        <h2
          class="group-hover:text-gold-400 text-3xl font-bold text-pretty transition-all"
        >
          Email
        </h2>
        <p
          class="text-pretty transition-all group-hover:text-stone-800 dark:group-hover:text-stone-300"
        >
          Not as quick... not as good... but if you're old-school, sure, be my
          guest.
        </p>
      </div>
    </a>
  </div>
  <div class="group flex w-[350px] items-center lg:w-[400px]">
    <a href="https://github.com/noxlovette" class="flex flex-row items-center">
      <div class="lg:ml-8 xl:ml-12">
        <h2
          class="group-hover:text-gold-400 text-3xl font-bold text-pretty transition-all"
        >
          GitHub
        </h2>
        <p
          class="text-pretty transition-all group-hover:text-stone-800 dark:group-hover:text-stone-300"
        >
          To talk about the code, documentation, and the license, as well as
          unit-testing...
        </p>
      </div>
    </a>
  </div>
</div>
