<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  import { page } from "$app/stores";
  import Button from "$lib/components/UI/Button.svelte";
  import { user } from "$lib/stores";
  import { CircleUser, InfoIcon } from "lucide-svelte";
  import MenuHeader from "./UI/MenuHeader.svelte";

  onMount(() => {
    user.subscribe((value) => {
      is_authenticated = value.is_authenticated;
      username = value.username;
    });
  });

  let is_authenticated = $user.is_authenticated;

  let username = $user.username;

  $: currentPath = $page.url.pathname;
  $: currentPage = currentPath.split("/")[1] || "welcome to bcf";
</script>

<header
  class="font-quicksand group relative z-20 my-4 flex w-full flex-col items-center justify-center lg:my-0"
>
  <div class="flex w-full max-w-[90vw] items-center justify-between">
    <a
      href="/"
      class="z-15 size-16 flex-none items-center justify-center md:size-20"
    >
      <img
        id="logo"
        class="z-50 size-16 md:size-20"
        src="/assets/img/bcf_logo_dark.png"
        alt="Go to home page"
      />
    </a>
    <div class="ml-4 hidden size-full flex-col justify-center md:m-8 md:flex">
      <div
        id="wider-part"
        class="border-gold-900 flex h-2/3 flex-grow border-b-2 xl:border-b-4"
      >
        <p class="m-2 text-3xl tracking-tighter">
          {currentPage}
        </p>

        <div
          id="user"
          class="mb-auto ml-auto mt-auto flex flex-row items-center justify-center space-x-4"
        >
          {#if is_authenticated}
            <a
              href="https://docs.bcfapp.app"
              title="learn to use BCF"
              class=" hover:text-gold-400 transition-all"
            >
              <InfoIcon />
            </a>

            <a
              id="profile"
              href="/profile"
              aria-label={username}
              title="{username}'s profile"
              class="hover:text-gold-400 transition-all"
            >
              <CircleUser />
            </a>
          {:else}
            <a href="/auth/login" class="hover:text-gold-400 transition-all"
              >login</a
            >
            <Button href="/auth/signup">sign up</Button>
          {/if}
        </div>
      </div>
      <div
        id="narrower-part"
        class="ml-2 flex h-1/3 flex-shrink transition-all"
        role="banner"
      >
        <nav id="navbar" class="flex flex-row text-sm md:mt-2 md:text-base">
          <!-- Permanent placeholder or minimal content -->

          <div
            in:fade={{ duration: 500 }}
            out:fade={{ duration: 200 }}
            role="button"
            tabindex="0"
            class="z-10"
          >
            <ul class="flex space-x-5">
              <li class="hover:text-navy-700 transition-all">
                <a href="/browse"> browse </a>
              </li>
              <li class=" hover:text-grapefruit-700 transition-all">
                <a href="/collect">collect</a>
              </li>
              <li class=" hover:text-aqua-700 transition-all">
                <a href="/formulate">formulate</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
    <MenuHeader />
  </div>
</header>

<style>
</style>
