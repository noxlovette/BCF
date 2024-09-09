<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { writable } from "svelte/store";
  import { logOut } from "$lib/DjangoAPI";
  import InformationIcon from "$lib/icons/InformationIcon.svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import Button from "$lib/components/UI/Button.svelte";
  import { user } from "$lib/stores";

  onMount(() => {
    user.subscribe((value) => {
      is_authenticated = value.is_authenticated;
      username = value.username;
    });
  });
  let is_authenticated = $user.is_authenticated;
  let username = $user.username;

  async function logout() {
    if (!is_authenticated) return;
    try {
      const response = await logOut();
      goto("/");
    } catch (error) {
      console.error("Failed to log out");
    }
  }

  let isDropdownOpen = false;
  let countdownTimer; // Variable to store the timer ID
  function toggleDropdown() {
    isDropdownOpen = true;
    resetCountdown();
  }

  // Function to start the countdown timer
  function startCountdown() {
    countdownTimer = setTimeout(closeDropdown, 3000);
  }

  // Function to reset the countdown timer
  function resetCountdown() {
    clearTimeout(countdownTimer); // Clear the existing countdown timer
    startCountdown(); // Start a new countdown timer
  }

  // Function to close the dropdown menu
  function closeDropdown() {
    isDropdownOpen = false;
  }

  $: currentPath = $page.url.pathname;
  $: currentPage = currentPath.split("/")[1] || "welcome to bcf";
</script>

<header
  class="group relative z-20 flex w-full flex-col items-center justify-center py-4 font-space"
>
  <div class="flex w-full max-w-7xl items-center justify-center">
    <a
      href="/"
      class="z-15 size-16 flex-none items-center justify-center transition-all md:size-20"
      on:mouseenter={toggleDropdown}
    >
      <img
        id="logo"
        class="z-50 size-16 md:size-20"
        src="/assets/img/bcf_logo_dark.png"
        alt="Go to home page"
      />
    </a>
    <div class="ml-2 size-full flex-col justify-center">
      <div
        id="wider-part"
        class="flex h-2/3 flex-grow border-b border-gold-900"
      >
        {#if currentPage}
          <p
            on:mouseenter={toggleDropdown}
            class="m-2 text-3xl font-light tracking-tighter"
          >
            {currentPage}
          </p>
        {/if}

        <div
          id="user"
          class="mb-auto ml-auto mt-auto flex flex-row items-center justify-center space-x-4"
        >
          {#if is_authenticated}
            <a
              href="https://docs.bcfapp.app"
              title="learn to use BCF"
              class=" transition-all hover:text-gold-400"
            >
              <InformationIcon />
            </a>

            <a
              id="profile"
              href="/profile"
              aria-label={username}
              title="{username}'s profile"
              class="transition-all hover:text-gold-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </a>
            <button
              id="logout"
              on:mousedown={logout}
              title="log out"
              class="transition-all hover:text-gold-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                />
              </svg>
            </button>
          {:else}
            <a href="/auth/login" class="transition-all hover:text-gold-400"
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
        <nav
          id="navbar"
          class="mt-2 flex flex-row"
          on:mouseenter={toggleDropdown}
        >
          <!-- Permanent placeholder or minimal content -->

          {#if isDropdownOpen}
            <div
              in:fade={{ duration: 500 }}
              out:fade={{ duration: 200 }}
              on:mouseleave={resetCountdown}
              role="button"
              tabindex="0"
              class="z-10"
            >
              <ul class="flex space-x-5">
                <li class="transition-all hover:text-navy-700">
                  <a href="/browse"> browse </a>
                </li>
                <li class=" transition-all hover:text-grapefruit-700">
                  <a href="/collect">collect</a>
                </li>
                <li class=" transition-all hover:text-aqua-700">
                  <a href="/formulate">formulate</a>
                </li>
              </ul>
            </div>
          {:else}
            <div class="space-x-5">
              <span class="invisible">Placeholder</span>
            </div>
          {/if}
        </nav>
      </div>
    </div>
  </div>
</header>

<style>
</style>
