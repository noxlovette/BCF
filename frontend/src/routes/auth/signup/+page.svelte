<script lang="ts">
  import { goto } from "$app/navigation";
  import { signUp } from "$lib/DjangoAPI";
  import { fade } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { onMount } from "svelte";
  import { notification } from "$lib/stores";
  let username = "";
  let email = "";
  let password = "";
  let validLength = false;
  let validSpecial = false;
  let validEmail = false;
  let validCase = false;
  let validDuplicate = false;
  let agreeTerms = false;
  let allValid = false;
  let confirmPassword = "";

  function checkPassword(password) {
    validLength = password.length >= 8;
    validCase =
      password.toUpperCase() != password && password.toLowerCase() != password;
    validSpecial = password.replaceAll(/\w/g, "").length > 0;
  }

  function checkEmail(email) {
    validEmail =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
        email,
      );
  }

  function passwordsMatch(password, confirmPassword) {
    validDuplicate = password === confirmPassword;
  }

  $: checkPassword(password);
  $: checkEmail(email);
  $: passwordsMatch(password, confirmPassword);
  $: allValid =
    validLength &&
    validCase &&
    validSpecial &&
    validEmail &&
    validDuplicate &&
    agreeTerms &&
    !!username;

  onMount(() => {
    // Check localStorage only once when the component is mounted
    agreeTerms = sessionStorage.getItem("terms") === "true";
  });

  async function handleSignup() {
    try {
      let body = {
        username: username,
        email: email,
        password: password,
      };
      const data = await signUp(body);
      if (data.error) {
        console.error("Server responded with an error:", data.error);
        notification.set(data.error);
      } else {
        sessionStorage.setItem("username", data.username);
        sessionStorage.setItem("is_authenticated", data.is_authenticated);
        notification.set({ message: "Signup successful!", type: "success" });
        goto("/collect/");
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
      notification.set({ message: "Something went wrong", type: "error" });
    }
  }
</script>

<svelte:head>
  <title>BCF | Signup</title>
</svelte:head>

<div class="mx-auto max-w-[800px] xl:max-w-7xl">
  <div
    id="authentification"
    class="m-10 flex flex-col items-center justify-center"
  >
    <form
      on:submit|preventDefault={handleSignup}
      class="flex h-[600px] w-[380px] flex-col items-start justify-start rounded bg-white p-8 shadow dark:bg-stone-950"
      in:fade={{
        duration: 100,
        easing: quintOut,
      }}
    >
      <h1 class="border-b-2 text-6xl font-bold tracking-tighter">
        sign up<span class="text-gold-400">.</span>
      </h1>

      <input
        type="text"
        class="my-2 mt-8 w-full rounded border-none bg-stone-50 shadow-inner focus:ring-2 focus:ring-gold-300 dark:bg-stone-800"
        placeholder="username"
        required
        bind:value={username}
      />

      <div id="handle email" class="mb-4 flex items-center justify-center">
        <input
          type="email"
          class="my-2 mr-auto w-[225] rounded border-none bg-stone-50 shadow-inner focus:ring-2 focus:ring-gold-300 dark:bg-stone-800"
          placeholder="email"
          bind:value={email}
        />
        <span
          class:valid={validEmail}
          class="ml-4 h-[40px] w-[96px] rounded bg-stone-50 p-2 text-left text-stone-900/60 shadow-inner dark:bg-stone-800 dark:text-stone-50/60"
          >valid</span
        >
      </div>
      <div id="handle pass" class="flex w-full items-center justify-center">
        <input
          type="password"
          class="my-2 mr-auto w-[225] rounded border-none bg-stone-50 shadow-inner focus:ring-2 focus:ring-gold-300 dark:bg-stone-800"
          placeholder="password"
          bind:value={password}
        />
        <span
          class:valid={validCase}
          class="mx-4 size-[40px] rounded bg-stone-50 p-2 normal-case text-stone-900/60 shadow-inner dark:bg-stone-800 dark:text-stone-50/60"
        >
          aZ
        </span>
        <span
          class:valid={validLength}
          class="text-baseline size-[40px] rounded bg-stone-50 p-2 text-stone-900/60 shadow-inner dark:bg-stone-800 dark:text-stone-50/60"
        >
          8+
        </span>
      </div>
      <div class="flex items-center justify-center" id="handle 2nd pass">
        <input
          type="password"
          class="my-2 mr-auto w-[225] rounded border-none bg-stone-50 shadow-inner focus:ring-2 focus:ring-gold-300 dark:bg-stone-800"
          placeholder="repeat"
          bind:value={confirmPassword}
        />
        <span
          class:valid={validDuplicate}
          class="mx-4 size-[40px] rotate-90 rounded bg-stone-50 p-2 text-center text-stone-900/60 shadow-inner dark:bg-stone-800 dark:text-stone-50/60"
          >||</span
        >
        <span
          class:valid={validSpecial}
          class="size-[40px] rounded bg-stone-50 p-2 text-center text-stone-900/60 shadow-inner dark:bg-stone-800 dark:text-stone-50/60"
          >&~</span
        >
      </div>
      <div
        id="paperwork"
        class="my-4 flex flex-row items-center justify-between space-x-4"
      >
        <a
          href="/paperwork/terms-of-service"
          on:mousedown={() => sessionStorage.setItem("terms", "true")}
          class="text-stone-900/80 hover:text-gold-400 dark:text-stone-50/80"
          >agree to the terms</a
        >
        <input
          type="checkbox"
          bind:checked={agreeTerms}
          class="shadow-inline size-4 rounded border-none bg-stone-50 text-aqua-500 ring-2 ring-stone-300/50 transition-all checked:bg-aqua-500 checked:ring-gold-300 hover:scale-110 hover:checked:bg-gold-300 focus:ring-aqua-700 active:scale-90 dark:bg-stone-800"
        />
      </div>
      <button
        type="submit"
        class="text-5xl font-bold tracking-tighter hover:text-gold-400 active:scale-90 disabled:text-stone-400/70"
        disabled={!allValid}>go</button
      >
      <a
        href="/auth/login"
        class="mt-auto flex text-sm opacity-60 transition-all hover:text-gold-400 hover:opacity-100"
        >have an account? sign in</a
      >
    </form>
  </div>
</div>

<style>
  .valid {
    @apply text-aqua-50;
    @apply bg-aqua-500;
  }
</style>
