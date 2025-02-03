<script lang="ts">
  import { fade } from "svelte/transition";
  import { page } from "$app/state";
  import Button from "$lib/components/UI/Button.svelte";
  import { user } from "$lib/stores";
  import { CircleUser, InfoIcon, Menu } from "lucide-svelte";

  let currentPath = $derived(page.url.pathname);
  let currentPage = $derived(currentPath.split("/")[1] || "welcome to bcf");

  // Simplified active state check
  let isActive = (path: string) => currentPath === `/${path}`;

  const navItems = [
    { path: "browse", label: "Browse", color: "navy" },
    { path: "collect", label: "Collect", color: "grapefruit" },
    { path: "formulate", label: "Formulate", color: "aqua" },
  ];
</script>

<header class="w-full bg-white shadow-sm dark:bg-zinc-900">
  <div class="mx-auto max-w-7xl px-4">
    <!-- Main Navigation Bar -->
    <div class="flex h-16 items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center">
        <a href="/" class="flex items-center space-x-3 hover:opacity-90">
          <img
            src="/assets/img/bcf_logo_dark.png"
            alt="BCF Logo"
            class="h-10 w-10"
          />
          <span class="hidden font-semibold md:block"> BCF </span>
        </a>
      </div>

      <!-- Navigation Links -->
      <nav class="hidden flex-1 md:block">
        <ul class="flex justify-center space-x-12">
          {#each navItems as { path, label, color }}
            <li>
              <a
                href="/{path}"
                class="relative py-1 text-sm font-medium transition-colors hover:text-{color}-600
                       {isActive(path)
                  ? `text-${color}-600`
                  : 'text-zinc-700 dark:text-zinc-300'}"
              >
                {label}
                {#if isActive(path)}
                  <span
                    class="absolute -bottom-1 left-0 h-0.5 w-full bg-{color}-600"
                  ></span>
                {/if}
              </a>
            </li>
          {/each}
        </ul>
      </nav>

      <!-- User Section -->
      <div class="flex items-center space-x-4">
        {#if $user.username}
          <div class="hidden items-center space-x-4 md:flex" transition:fade>
            <a
              href="https://docs.bcfapp.app"
              class="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              title="Documentation"
            >
              <InfoIcon class="h-5 w-5" />
            </a>
            <span class="text-sm">{$user.username}</span>
            <a
              href="/profile"
              class="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <CircleUser class="h-5 w-5" />
            </a>
          </div>
        {:else}
          <div class="hidden md:flex md:items-center md:space-x-4">
            <a
              href="/auth/login"
              class="text-sm text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
            >
              Log in
            </a>
            <Button href="/auth/signup">Sign up</Button>
          </div>
        {/if}

        <button
          class="rounded p-1 hover:bg-zinc-100 md:hidden dark:hover:bg-zinc-800"
          aria-label="Menu"
        >
          <Menu class="h-6 w-6" />
        </button>
      </div>
    </div>

    <!-- Page Title -->
    {#if currentPage !== "welcome to bcf"}
      <div class="border-t border-zinc-200 py-2 dark:border-zinc-800">
        <h1
          class="text-lg font-medium text-zinc-700 capitalize dark:text-zinc-300"
        >
          {currentPage}
        </h1>
      </div>
    {/if}
  </div>
</header>
