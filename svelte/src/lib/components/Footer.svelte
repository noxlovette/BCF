<script lang="ts">
  import Credits from "./Credits.svelte";

  let legalOn = false;

  function toggleLegal() {
    legalOn = !legalOn;
  }
</script>

<div class="flex w-full max-w-[90vw]">
  <p
    class="font-quicksand text-gold-400/80 -mb-2 text-left text-4xl font-bold lg:text-7xl"
  >
    BCF. the app for perfumers
  </p>
</div>
<footer
  class="z-10 flex w-full flex-col items-center justify-between bg-zinc-300 py-4 text-zinc-600 shadow-inner dark:bg-zinc-900"
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
        <li>
          <a href="https:x.com/app_bcf" class="transition-all hover:underline">
            twitter
          </a>
        </li>
      </ul>
      <a
        href="https://docs.bcfapp.app"
        title="learn to use BCF"
        class=" text-zinc-900 transition-all hover:underline lg:ml-12 dark:text-zinc-400"
      >
        how to use this thing
      </a>
    </div>
  </div>
</footer>
