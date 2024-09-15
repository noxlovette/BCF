<script lang="ts">
  import { fade } from "svelte/transition";
    import Credits from "./Credits.svelte";

  let legalOn = false;

  function toggleLegal() {
    legalOn = !legalOn;
  }
</script>

<div class="flex w-full max-w-[90vw]">
<p class="text-4xl lg:text-7xl font-quicksand text-gold-400/80 text-left font-bold -mb-2">
  BCF. the app for perfumers
  </p>
</div>
<footer
  class="z-10 flex w-full flex-col justify-between bg-stone-300 shadow-inner py-4 items-center dark:bg-stone-900 text-stone-600"
>
  <div class="flex flex-col w-[90vw]">
    <Credits />
    <div id="paperwork" class="flex w-full flex-col md:flex-row text-left space-y-4 md:space-y-0 md:justify-between">
      <ul class="flex md:space-x-4 flex-col md:flex-row">
        
        <li>
          <a
            href="/paperwork/about"
            class="transition-all hover:underline"
          >
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
                  class=" transition-all text-stone-900 dark:text-stone-400 hover:underline lg:ml-12"
                >
                how to use this thing
                </a>
    </div>
  </div>
</footer>
