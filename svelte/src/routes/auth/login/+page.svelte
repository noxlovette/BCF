<script lang="ts">
  import { goto } from "$app/navigation";
  import { enhance } from "$app/forms";
  import { fade } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { notification, user } from "$lib/stores";

  let username = "";
  let password = "";

  const handleLoginResult = async ({ result, update }) => {
    if (result.type === "success") {
      $user.is_authenticated = true;
      localStorage.setItem("user", result.data.user);
      notification.set({ message: "Welcome back!", type: "success" });
      await goto("/collect/");
    } else {
      notification.set({
        message: result.data.error || "Login failed",
        type: "error",
      });
    }
    update();
  };
</script>

<div class="mx-auto xl:max-w-7xl">
  <div id="authentification" class="m-10 flex flex-col items-center p-10">
    <form
      method="POST"
      action="?/login"
      use:enhance={() => handleLoginResult}
      class="flex flex-col items-start justify-start rounded bg-white p-8 shadow dark:bg-stone-900"
      in:fade={{
        duration: 100,
        easing: quintOut,
      }}
    >
      <h1 class="mb-8 border-b-2 text-6xl font-bold tracking-tighter">
        sign in<span class="text-gold-400">.</span>
      </h1>

      <input
        id="username-field"
        type="text"
        name="username"
        class="focus:ring-gold-300 my-4 w-full rounded border-none bg-stone-50 p-2 shadow-inner focus:ring-2 dark:bg-stone-800"
        placeholder="username"
        bind:value={username}
        required
      />
      <input
        id="password-field"
        type="password"
        name="password"
        class="focus:ring-gold-300 my-2 w-full rounded border-none bg-stone-50 p-2 shadow-inner focus:ring-2 dark:bg-stone-800"
        placeholder="password"
        bind:value={password}
        required
      />
      <div
        class="cf-turnstile my-4"
        data-sitekey="0x4AAAAAAA6xKvX8IgCZg0J0"
      ></div>
      <button
        type="submit"
        class="hover:text-gold-400 text-4xl font-bold tracking-tighter transition-all active:scale-90"
      >
        go
      </button>
      <a
        href="/auth/signup"
        class="hover:text-gold-400 mt-auto flex text-sm opacity-60 transition-all hover:opacity-100"
      >
        don't have an account?</a
      >
    </form>
  </div>
</div>

<svelte:head>
  <title>BCF | Login</title>
  <script
    src="https://challenges.cloudflare.com/turnstile/v0/api.js"
    async
    defer
  ></script>
</svelte:head>
