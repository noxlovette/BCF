<script lang="ts">
  import Credits from "./Credits.svelte";

  let legalOn = false;

  function toggleLegal() {
    legalOn = !legalOn;
  }
</script>

<div class="mt-10 flex w-full max-w-[90vw]">
  <p
    class="font-quicksand text-saffron-400/80 -mb-2 text-left text-4xl font-bold lg:text-7xl"
  >
    BCF. the app for perfumers
  </p>
</div>
<footer
  class="z-10 flex w-full flex-col items-center justify-between bg-stone-300 py-4 text-stone-600 shadow-inner dark:bg-stone-900"
>
  <div class="flex w-[90vw] flex-col">
    <Credits />
    <div
      id="paperwork"
      class="flex w-full flex-col space-y-4 text-left md:flex-row md:justify-between md:space-y-0"
    >
      <ul class="flex flex-col md:flex-row md:space-x-4">
        <li>
          <a href="/paperwork/about" class="transition-all hover:underline">
            about
          </a>
        </li>
        <li>
          <a
            href="/paperwork/contact-us"
            class="transition-all hover:underline"
          >
            contact me
          </a>
        </li>
        <li>
          <a
            href="/paperwork/terms-of-service"
            class="transition-all hover:underline"
          >
            terms of use
          </a>
        </li>
        <li>
          <a
            href="/paperwork/privacy-policy"
            class="transition-all hover:underline"
          >
            privacy policy
          </a>
        </li>
      </ul>
      <a
        href="https://docs.bcfapp.app"
        title="learn to use BCF"
        class=" text-stone-900 transition-all hover:underline lg:ml-12 dark:text-stone-400"
      >
        how to use this thing
      </a>
    </div>
  </div>
</footer>
