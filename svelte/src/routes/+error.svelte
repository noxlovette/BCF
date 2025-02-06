<script lang="ts">
  import { page } from "$app/state";
</script>

<div class="text-center">
  <div class="py-12 sm:py-8 md:py-12 lg:py-14 xl:py-12 2xl:py-28">
    <div class="flex size-full max-w-7xl flex-col items-center justify-center">
      <h1 class="text-6xl font-bold text-red-500">
        Uh-oh! 🚨 Error {page.status}
      </h1>
      <p class="mt-4 text-xl">
        Looks like something broke... probably not your fault. <br />
        But hey, if you want to take credit, be my guest.
      </p>
      <img
        src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnJqNWwxcnkzamJqdjgzbmxjMTBkbG91MjQ0bXBnYXV6MWxlcnNnZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l41Ym49ppcDP6iY3C/giphy.gif"
        alt="Confused meme"
        class="mt-6 h-auto w-80 rounded-lg shadow-lg"
      />
      <p class="mt-4 text-lg">
        {page.error.message || "Mysterious forces at work..."}
      </p>
      <a
        href="https://t.me/noxlovette"
        class="mt-6 inline-block rounded-lg bg-yellow-400 px-6 py-3 text-2xl font-bold text-black shadow-lg transition duration-300 hover:bg-yellow-500"
      >
        😡 Yell at me about this
      </a>
      <p class="mt-4 text-sm text-gray-500">
        * Clicking will not actually fix the issue, but it might make you feel
        better.
      </p>
    </div>
  </div>
</div>
