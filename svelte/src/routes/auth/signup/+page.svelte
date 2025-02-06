<script lang="ts">
  import { fade } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { onMount } from "svelte";
  import { notification } from "$lib/stores";
  import { enhance } from "$app/forms";

  let username = $state("");
  let email = $state("");
  let password = $state("");
  let agreeTerms = $state(false);
  let confirmPassword = $state("");
  let isSubmitting = $state(false);

  let valid = $state({
    length: false,
    special: false,
    email: false,
    case: false,
    match: false,
    terms: false,
  });

  $effect(() => {
    valid.length = password.length >= 8;
    valid.case = /[a-z]/.test(password) && /[A-Z]/.test(password);
    valid.special = /[\W_]/.test(password);
    valid.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    valid.match = password === confirmPassword;
  });

  onMount(() => {
    valid.terms = sessionStorage.getItem("terms") === "true";
  });
</script>

<svelte:head>
  <title>BCF | Signup</title>
</svelte:head>

<form
  class="mt-8 max-w-md space-y-6 rounded-lg bg-white p-3 dark:bg-stone-900"
  in:fade={{
    duration: 100,
    easing: quintOut,
  }}
  method="POST"
  use:enhance={() => {
    isSubmitting = true;
    return async ({ result, update }) => {
      isSubmitting = false;
      if (result.type === "redirect") {
        notification.set({
          message: "Welcome on Board!",
          type: "success",
        });
        update();
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
  <h1 class="border-b-2 text-6xl font-bold tracking-tighter">
    sign up<span class="text-saffron-400">.</span>
  </h1>

  <div class="flex space-x-4">
    <input
      type="text"
      name="username"
      class="focus:ring-saffron-300 mt-8 w-full rounded border-none bg-stone-50 p-2 shadow-inner focus:ring-2 dark:bg-stone-800"
      placeholder="username"
      required
      bind:value={username}
    />
    <input
      type="text"
      name="name"
      class="focus:ring-saffron-300 mt-8 w-full rounded border-none bg-stone-50 p-2 shadow-inner focus:ring-2 dark:bg-stone-800"
      placeholder="Name"
      required
    />
  </div>

  <div id="handle email" class="flex items-center justify-center">
    <input
      type="email"
      name="email"
      class="focus:ring-saffron-300 rounded border-none bg-stone-50 p-2 shadow-inner focus:ring-2 dark:bg-stone-800"
      placeholder="email"
      bind:value={email}
    />
    <span
      class:valid={valid.email}
      class="ml-4 h-[40px] w-[96px] rounded bg-stone-50 p-2 text-left text-stone-900/60 shadow-inner dark:bg-stone-800 dark:text-stone-50/60"
      >valid</span
    >
  </div>
  <div id="handle pass" class="flex items-center justify-center">
    <input
      type="password"
      name="password"
      class="focus:ring-saffron-300 mr-auto rounded border-none bg-stone-50 p-2 shadow-inner focus:ring-2 dark:bg-stone-800"
      placeholder="password"
      bind:value={password}
    />
    <span
      class:valid={valid.case}
      class="mx-4 size-[40px] rounded bg-stone-50 p-2 text-stone-900/60 normal-case shadow-inner dark:bg-stone-800 dark:text-stone-50/60"
    >
      aZ
    </span>
    <span
      class:valid={valid.length}
      class="text-baseline size-[40px] rounded bg-stone-50 p-2 text-stone-900/60 shadow-inner dark:bg-stone-800 dark:text-stone-50/60"
    >
      8+
    </span>
  </div>
  <div class="flex items-center justify-center" id="handle 2nd pass">
    <input
      type="password"
      name="confirmPassword"
      class="focus:ring-saffron-300 rounded border-none bg-stone-50 p-2 shadow-inner focus:ring-2 dark:bg-stone-800"
      placeholder="repeat"
      bind:value={confirmPassword}
    />
    <span
      class:valid={valid.match}
      class="mx-4 size-[40px] rotate-90 rounded bg-stone-50 p-2 text-center text-stone-900/60 shadow-inner dark:bg-stone-800 dark:text-stone-50/60"
      >||</span
    >
    <span
      class:valid={valid.special}
      class="size-[40px] rounded bg-stone-50 p-2 text-center text-stone-900/60 shadow-inner dark:bg-stone-800 dark:text-stone-50/60"
      >&~</span
    >
  </div>
  <div
    id="paperwork"
    class="flex flex-row items-center justify-between space-x-4"
  >
    <a
      href="/paperwork/terms-of-service"
      onclick={() => sessionStorage.setItem("terms", "true")}
      class="hover:text-saffron-400 text-stone-900/80 dark:text-stone-50/80"
      >agree to the terms</a
    >
    <input
      type="checkbox"
      bind:checked={valid.terms}
      class="shadow-inline text-hunter-500 checked:bg-hunter-500 checked:ring-saffron-300 hover:checked:bg-saffron-300 focus:ring-hunter-700 size-4 rounded border-none bg-stone-50 ring-2 ring-stone-300/50 transition-all hover:scale-110 active:scale-90 dark:bg-stone-800"
    />
  </div>
  <div class="cf-turnstile my-4" data-sitekey="0x4AAAAAAA6xKvX8IgCZg0J0"></div>
  <button
    type="submit"
    class="hover:text-saffron-400 text-5xl font-bold tracking-tighter active:scale-90 disabled:text-stone-400/70"
    disabled={!Object.values(valid).every(Boolean)}>go</button
  >
  <a
    href="/auth/login"
    class="hover:text-saffron-400 mt-auto flex text-sm opacity-60 transition-all hover:opacity-100"
    >have an account? sign in</a
  >
</form>

<style>
  .valid {
    background-color: green;
  }
</style>
