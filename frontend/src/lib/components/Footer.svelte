<script lang="ts">
  import { fade } from "svelte/transition";

  let legalOn = false;

  function toggleLegal() {
    legalOn = !legalOn;
  }
</script>

<footer
  class="relative z-10 flex w-full flex-col items-center justify-between bg-stone-300 py-8 shadow-inner dark:bg-stone-900 text-stone-600"
>
  <div class="flex w-full max-w-7xl items-center justify-between font-bold">
    <div id="copyright" class="flex w-full items-center">
      <p class="md:text-center opacity-60">© 2024 Danila Volkov</p>
    </div>

    <div id="paperwork" class="md:text-md relative flex w-full justify-end">
      <ul class="flex space-x-4">
        
        <li>
          <a
            href="/paperwork/about"
            class="transition-all hover:text-stone-500"
          >
            about
          </a>
        </li>
        <li>
          <a
            href="/paperwork/contact-us"
            class="transition-all hover:text-stone-500"
          >
            contact me
          </a>
        </li>
              <li>
                <a
                  href="/paperwork/privacy-policy"
                  class="transition-all hover:text-stone-500"
                >
                  privacy policy
                </a>
              </li>
              <li>
                <a
                  href="/paperwork/terms-of-service"
                  class="transition-all hover:text-stone-500"
                >
                  terms of use
                </a>
            </li>
            <li>
              <a
                  href="https://docs.bcfapp.app"
                  title="learn to use BCF"
                  class=" transition-all text-stone-950 hover:text-stone-500 ml-12"
                >
                how to use this thing
                </a>
            </li>
      </ul>
    </div>
  </div>
</footer>
