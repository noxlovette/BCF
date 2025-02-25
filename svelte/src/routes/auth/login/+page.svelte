<script lang="ts">
  import { enhance } from "$app/forms";
  import { fade } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { notification, setUser } from "$lib/stores";
  import { goto } from "$app/navigation";
  import { H1, Input, Turnstile } from "$lib/components";
  import SubmitButton from "$lib/components/UI/button/SubmitButton.svelte";

  let username = $state("");
  let password = $state("");
  let isSubmitting = $state(false);
</script>

<form
  class="max-w-md space-y-4 rounded-b-lg bg-white p-6 dark:bg-stone-900"
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
  <h1 class="place-self-center uppercase lg:text-2xl">Sign In</h1>

  <Input name="username" placeholder="Username" bind:value={username} />

  <Input
    name="password"
    placeholder="Password"
    type="password"
    bind:value={password}
  />

  <Turnstile />

  <SubmitButton>Go</SubmitButton>
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
