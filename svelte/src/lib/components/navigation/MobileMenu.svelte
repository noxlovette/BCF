<script>
  import { goto } from "$app/navigation";
  import { Menu } from "lucide-svelte";
  import { user } from "$lib/stores";
  import { X } from "lucide-svelte";

  export let isOpen = false;

  let is_authenticated = $user.is_authenticated;

  function toggleMenu() {
    isOpen = !isOpen;
  }

  function navigateAndCloseMenu(path) {
    goto(path); // Navigate to the new page
    isOpen = false; // Close the menu
  }
</script>

<button
  class="bg-opacity-80 fixed inset-0 z-40 bg-zinc-900 backdrop-blur-lg transition-all duration-300 ease-in-out md:hidden {isOpen
    ? 'pointer-events-auto opacity-100'
    : 'pointer-events-none opacity-0'}"
  on:click|self={toggleMenu}
/>

<div class="flex md:hidden">
  <button
    on:click|stopPropagation={toggleMenu}
    class="hover:bg-gold-400 rounded-lg bg-zinc-300 px-4 py-2 transition-colors duration-300 dark:bg-zinc-800 dark:hover:text-zinc-800"
  >
    <Menu class="size-8" />
  </button>

  <div
    class="absolute top-0 right-0 w-full transform space-y-4 rounded-lg
    bg-zinc-300 px-8 py-12 shadow-lg
    
    transition-transform duration-300 ease-in-out dark:bg-zinc-900 {isOpen
      ? 'visible translate-x-0'
      : 'invisible translate-x-full'} z-50"
  >
    <div class="flex items-center justify-between">
      <h1 class="text-4xl">BCF</h1>
      <button on:click={toggleMenu}>
        <X class="size-8 opacity-65" />
      </button>
    </div>
    <nav class="space-y-8">
      <ul class="flex flex-col space-y-2">
        <a
          href="/browse"
          on:click|preventDefault={() => navigateAndCloseMenu("/browse")}
          class="hover:bg-gold-400 block rounded bg-zinc-700 p-2 text-xl text-zinc-100 transition-colors hover:text-zinc-800"
          >Browse</a
        >

        <a
          href="/collect"
          on:click|preventDefault={() => navigateAndCloseMenu("/collect")}
          class="hover:bg-gold-400 block rounded bg-zinc-700 p-2 text-xl text-zinc-100 transition-colors hover:text-zinc-800"
          >Collect</a
        >

        <a
          href="/formulate"
          on:click|preventDefault={() => navigateAndCloseMenu("/formulate")}
          class="hover:bg-gold-400 block rounded bg-zinc-700 p-2 text-xl text-zinc-100 transition-colors hover:text-zinc-800"
          >Formulate</a
        >
      </ul>
      <ul class="flex flex-col space-y-2">
        {#if is_authenticated}
          <a
            href="https://docs.bcfapp.app"
            title="learn to use BCF"
            class="hover:bg-gold-400 block rounded bg-zinc-700 p-2 text-xl text-zinc-100 transition-colors hover:text-zinc-800"
          >
            How To
          </a>

          <a
            id="profile"
            href="/profile"
            on:click|preventDefault={() => navigateAndCloseMenu("/profile")}
            class="hover:bg-gold-400 block rounded bg-zinc-700 p-2 text-xl text-zinc-100 transition-colors hover:text-zinc-800"
          >
            Profile
          </a>
        {:else}
          <a
            href="/auth/login"
            on:click|preventDefault={() => navigateAndCloseMenu("/auth/login")}
            class="hover:bg-gold-400 block rounded bg-zinc-700 p-2 text-xl text-zinc-100 transition-colors hover:text-zinc-800"
            >Login</a
          >
          <a
            href="/auth/signup"
            on:click|preventDefault={() => navigateAndCloseMenu("/auth/signup")}
            class="hover:bg-gold-400 block rounded bg-zinc-700 p-2 text-xl text-zinc-100 transition-colors hover:text-zinc-800"
            >Sign up</a
          >
        {/if}
      </ul>
    </nav>
  </div>
</div>
