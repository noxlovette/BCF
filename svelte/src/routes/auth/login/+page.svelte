<script lang="ts">
  import { enhance } from "$app/forms";
  import { fade } from "svelte/transition";
  import { notification, setUser } from "$lib/stores";
  import { redirect } from "@sveltejs/kit";
  import { goto } from "$app/navigation";

  let username = $state("");
  let password = $state("");
  let isSubmitting = $state(false);
</script>

<div class="mx-auto xl:max-w-7xl">
  <div id="authentification" class="m-10 flex flex-col items-center p-10">
    <form
      method="POST"
      use:enhance={() => {
        isSubmitting = true;

        return async ({ result }) => {
          isSubmitting = false;

          if (result.type === "success" && result.data) {
            const { user } = result.data;
            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));
            notification.set({ message: "Welcome!", type: "success" });
            goto("/");
          } else if (result.type === "failure") {
            notification.set({
              message: String(result.data?.message) || "Something's off",
              type: "info",
            });
          } else if (result.type === "error") {
            notification.set({
              message: String(result.error?.message) || "Something's off",
              type: "error",
            });
          }
        };
      }}
      class="mt-8 max-w-md space-y-6 rounded-lg bg-white p-3 dark:bg-stone-900"
      in:fade
    >
      <h1 class="mb-8 border-b-2 text-6xl font-bold tracking-tighter">
        sign in<span class="text-saffron-400">.</span>
      </h1>

      <input
        id="username-field"
        type="text"
        name="username"
        class="focus:ring-saffron-300 my-4 w-full rounded border-none bg-stone-50 p-2 shadow-inner focus:ring-2 dark:bg-stone-800"
        placeholder="username"
        bind:value={username}
        required
      />
      <input
        id="password-field"
        type="password"
        name="password"
        class="focus:ring-saffron-300 my-2 w-full rounded border-none bg-stone-50 p-2 shadow-inner focus:ring-2 dark:bg-stone-800"
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
        class="hover:text-saffron-400 text-4xl font-bold tracking-tighter transition-all active:scale-90"
      >
        go
      </button>
      <a
        href="/auth/signup"
        class="hover:text-saffron-400 mt-auto flex text-sm opacity-60 transition-all hover:opacity-100"
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
