<script lang="ts">
  import { goto, invalidate } from "$app/navigation";
  import { enhance } from "$app/forms";
  import { fade } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  import { notification, setUser, user } from "$lib/stores";

  let username = "";
  let password = "";
  export let form;

  const handleLoginResult = async ({ result, update }) => {
    if (result.data.success) {
      $user.is_authenticated = true;
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

<svelte:head>
  <title>BCF | Login</title>
</svelte:head>

<div class="mx-auto max-w-[800px] xl:max-w-7xl">
  <div id="authentification" class="m-10 flex flex-col items-center p-10">
    <form
      method="POST"
      action="?/login"
      use:enhance={() => handleLoginResult}
      class="flex h-[475px] w-[300px] flex-col items-start justify-start rounded bg-white p-8 shadow dark:bg-stone-950"
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
        class="my-4 w-full rounded border-none bg-stone-50 p-2 shadow-inner focus:ring-2 focus:ring-gold-300 dark:bg-stone-800"
        placeholder="username"
        bind:value={username}
        required
      />
      <input
        id="password-field"
        type="password"
        name="password"
        class="my-2 w-full rounded border-none bg-stone-50 p-2 shadow-inner focus:ring-2 focus:ring-gold-300 dark:bg-stone-800"
        placeholder="password"
        bind:value={password}
        required
      />
      <button
        type="submit"
        class="text-4xl font-bold tracking-tighter transition-all hover:text-gold-400 active:scale-90"
      >
        go
      </button>
      <a
        href="/auth/signup"
        class="mt-auto flex text-sm opacity-60 transition-all hover:text-gold-400 hover:opacity-100"
      >
        don't have an account?</a
      >
    </form>

    {#if form?.success === false}
      <p class="error">{form.error}</p>
    {/if}
  </div>
</div>
