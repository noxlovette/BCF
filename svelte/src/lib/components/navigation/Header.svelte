<script lang="ts">
  import { fade } from "svelte/transition";
  import { page } from "$app/state";
  import { user } from "$lib/stores";
  import { CircleUser, InfoIcon, Menu } from "lucide-svelte";

  const isActive = (route: string) => page.url.pathname.startsWith(route);
</script>

<header class="font-manrope w-full bg-white shadow-md dark:bg-stone-900">
  <div class="mx-auto max-w-7xl px-4">
    <div class="flex grid h-16 w-full grid-cols-3 items-center">
      <div class="flex items-center">
        <a href="/" class="flex items-center space-x-3 hover:opacity-90">
          <img
            src="/assets/img/bcf_logo_dark.png"
            alt="BCF Logo"
            class="h-10 w-10"
          />
        </a>
      </div>

      <nav
        class="flex items-center justify-center gap-8 text-2xl tracking-tight uppercase"
      >
        <a
          href="/browse"
          class:font-bold={isActive("/browse")}
          class="hover:opacity-80"
        >
          Browse
        </a>

        <a
          href="/collect"
          class:font-bold={isActive("/collect")}
          class="hover:opacity-80"
        >
          Collect
        </a>

        <a
          href="/formulate"
          class:font-bold={isActive("/formulate")}
          class="hover:opacity-80"
        >
          Formulate
        </a>
      </nav>

      <div class="flex items-center justify-end space-x-4">
        {#if $user.username}
          <div class="hidden items-center space-x-4 md:flex" transition:fade>
            <a
              href="https://docs.bcfapp.app"
              class="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
              title="Documentation"
            >
              <InfoIcon class="h-5 w-5" />
            </a>
            <span class="text-sm">{$user.username}</span>
            <a
              href="/profile"
              class="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
            >
              <CircleUser class="h-5 w-5" />
            </a>
          </div>
        {:else}
          <div class="hidden md:flex md:items-center md:space-x-4">
            <a
              href="/auth/login"
              class="text-sm text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100"
            >
              Log in
            </a>
            <a href="/auth/signup">Sign up</a>
          </div>
        {/if}

        <button
          class="rounded p-1 hover:bg-stone-100 md:hidden dark:hover:bg-stone-800"
          aria-label="Menu"
        >
          <Menu class="h-6 w-6" />
        </button>
      </div>
    </div>
  </div>
</header>
