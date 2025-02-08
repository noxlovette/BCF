<script lang="ts">
  import { enhance } from "$app/forms";
  import { fade } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { notification, setUser } from "$lib/stores";
  import { goto } from "$app/navigation";
  import { H1 } from "$lib/components";

  let username = $state("");
  let password = $state("");
  let isSubmitting = $state(false);
</script>

<form
  class="max-w-md space-y-6 rounded-b-lg bg-white p-3 dark:bg-stone-900"
  in:fade={{
    duration: 100,
    easing: quintOut,
  }}
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
>
  <H1>Sign In</H1>

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
  <div class="cf-turnstile my-4" data-sitekey="0x4AAAAAAA6xKvX8IgCZg0J0"></div>
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

<svelte:head>
  <title>BCF | Login</title>
</svelte:head>
