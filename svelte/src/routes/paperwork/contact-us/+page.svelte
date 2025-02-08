<script>
  import BigText from "$lib/components/typography/BigText.svelte";
</script>

<div class="lowercase">
  <BigText text="Contact Me<span class='text-saffron-400'>.</span>" />
</div>

<ul class="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
  <li class="rounded-lg bg-white p-2 dark:bg-stone-900">
    <a
      href="https://t.me/noxlovette"
      class="hover:text-saffron-400 text-3xl font-bold text-pretty transition-all"
    >
      Telegram
    </a>
  </li>
  <li class="rounded-lg bg-white p-2 dark:bg-stone-900">
    <a
      href="mailto:danila.volkov@noxlovette.com"
      class="hover:text-saffron-400 text-3xl font-bold text-pretty transition-all"
    >
      Email
    </a>
  </li>
  <li class="rounded-lg bg-white p-2 dark:bg-stone-900">
    <a
      href="https://github.com/noxlovette"
      class="hover:text-saffron-400 text-3xl font-bold text-pretty transition-all"
    >
      GitHub
    </a>
  </li>
</ul>
