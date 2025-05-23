<script lang="ts">
  import { fade } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { onMount } from "svelte";
  import { notification } from "$lib/stores";
  import { enhance } from "$app/forms";
  import { Input, Turnstile } from "$lib/components";
  import SubmitButton from "$lib/components/UI/button/SubmitButton.svelte";

  let username = $state("");
  let email = $state("");
  let password = $state("");
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
  class="max-w-md space-y-4 rounded-b-lg bg-white p-6 dark:bg-stone-900"
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
  <h1 class="place-self-center uppercase lg:text-2xl">Sign up</h1>

  <Input
    type="text"
    name="username"
    placeholder="Username"
    bind:value={username}
  ></Input>
  <Input type="text" name="name" placeholder="Name" colour="saffron" value=""
  ></Input>

  <Input name="email" placeholder="Email" bind:value={email}></Input>

  <div id="handle pass" class="flex space-x-3">
    <Input
      type="password"
      name="password"
      placeholder="Password"
      bind:value={password}
    />
    <div class="flex items-center justify-between space-x-2">
      <span
        class:valid={valid.case}
        class="aspect-square rounded bg-stone-50 p-2 text-stone-900/60 normal-case shadow-inner dark:bg-stone-800 dark:text-stone-50/60"
      >
        aZ
      </span>
      <span
        class:valid={valid.length}
        class="text-baseline aspect-square rounded bg-stone-50 p-2 text-stone-900/60 shadow-inner dark:bg-stone-800 dark:text-stone-50/60"
      >
        8+
      </span>
      <span
        class:valid={valid.special}
        class="aspect-square rounded bg-stone-50 p-2 text-center text-stone-900/60 shadow-inner dark:bg-stone-800 dark:text-stone-50/60"
        >&~</span
      >
    </div>
  </div>

  <Input
    type="password"
    name="confirmPassword"
    placeholder="Repeat"
    bind:value={confirmPassword}
  />

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
  <Turnstile />

  <SubmitButton disabled={!Object.values(valid).every(Boolean)}>Go</SubmitButton
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
