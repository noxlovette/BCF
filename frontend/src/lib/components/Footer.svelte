<script lang="ts">
  import { fade } from "svelte/transition";

  let legalOn = false;

  function toggleLegal() {
    legalOn = !legalOn;
  }
</script>

<footer
  class="relative z-10 flex w-full flex-col items-center justify-between bg-stone-300 py-8 shadow-inner dark:bg-stone-900"
>
  <div class="flex w-full max-w-7xl items-center justify-between font-bold">
    <div id="copyright" class="flex w-full items-center">
      <p class="md:text-center">© 2024 Danila Volkov</p>
    </div>

    <div id="paperwork" class="md:text-md relative flex w-full justify-end">
      <ul class="flex *:mx-4 sm:*:mx-2">
        <li>
          <a
            href="/paperwork/about"
            class="transition-all hover:text-amber-400"
          >
            about
          </a>
        </li>
        <li>
          <a
            href="/paperwork/contact-us"
            class="transition-all hover:text-amber-400"
          >
            contact me
          </a>
        </li>
        <li class="relative">
          <button
            on:mousedown={toggleLegal}
            class="transition-all hover:text-amber-400"
          >
            legal
          </button>
          {#if legalOn}
            <div
              class="absolute bottom-full right-0 mb-2 flex flex-col space-y-2 rounded bg-stone-50 p-2 shadow-lg dark:bg-stone-800"
              in:fade
            >
              <li>
                <a
                  href="/paperwork/privacy-policy"
                  class="transition-all hover:text-amber-400"
                >
                  privacy policy
                </a>
              </li>
              <li>
                <a
                  href="/paperwork/terms-of-service"
                  class="transition-all hover:text-amber-400"
                >
                  terms of use
                </a>
              </li>
            </div>
          {/if}
        </li>
      </ul>
    </div>
  </div>
</footer>
