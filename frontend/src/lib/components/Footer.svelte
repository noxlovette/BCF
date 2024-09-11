<script lang="ts">
  import { fade } from "svelte/transition";

  let legalOn = false;

  function toggleLegal() {
    legalOn = !legalOn;
  }
</script>

<footer
  class="relative z-10 flex w-full flex-col items-center justify-between py-2 opacity-80"
>
  <div
    class="xs:grid-cols-1 clear-end mt-4 grid w-full max-w-7xl justify-between text-sm font-semibold sm:grid-cols-1 sm:gap-4 md:grid-cols-3 md:gap-6 xl:gap-8"
  >
    <div id="social" class="flex w-full items-center">
      <ul class="flex items-center space-x-4">
        <li class="">
          <a href="https://twitter.com/BCF_app">
            <svg
              width="18"
              height="18"
              viewBox="0 0 1200 1227"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="transition-all hover:scale-110 hover:text-amber-400 active:scale-90"
            >
              <path
                d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
                fill="currentColor"
              />
            </svg>
          </a>
        </li>
        <li>
          <a href="https://patreon.com/BCF_app" class="">
            <svg
              width="18"
              height="18"
              viewBox="0 0 1080 1080"
              xmlns="http://www.w3.org/2000/svg"
              class="transition-all hover:scale-110 hover:text-amber-400 active:scale-90"
            >
              <path
                d="M1033.05,324.45c-0.19-137.9-107.59-250.92-233.6-291.7c-156.48-50.64-362.86-43.3-512.28,27.2
	C106.07,145.41,49.18,332.61,47.06,519.31c-1.74,153.5,13.58,557.79,241.62,560.67c169.44,2.15,194.67-216.18,273.07-321.33
	c55.78-74.81,127.6-95.94,216.01-117.82C929.71,603.22,1033.27,483.3,1033.05,324.45z"
                fill="currentColor"
              />
            </svg>
          </a>
        </li>
        <li>
          <a href="https://github.com/noxlovette/BCF" class="">
            <svg
              width="20"
              height="20"
              viewBox="0 0 98 96"
              xmlns="http://www.w3.org/2000/svg"
              class="transition-all hover:scale-110 hover:text-amber-400 active:scale-90"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                fill="currentColor"
              />
            </svg>
          </a>
        </li>
      </ul>
    </div>

    <div id="copyright" class="flex w-full items-center justify-center">
      <p class="m-4 md:text-center">© 2024 Danila Volkov</p>
    </div>

    <div
      id="paperwork"
      class="md:text-md relative m-2 ml-auto flex w-full justify-end sm:text-sm"
    >
      <ul class="flex items-center *:mx-4 sm:*:mx-2">
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
