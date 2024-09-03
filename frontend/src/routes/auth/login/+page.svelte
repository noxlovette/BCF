<script lang="ts">
  import { goto } from "$app/navigation";
  import { logIn } from "$lib/DjangoAPI";
  import { fade } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { fetchCollection } from "$lib/DjangoAPI";

  import { notification } from "$lib/stores/notificationStore";

  let username = "";
  let password = "";

  const handleSubmit = async (event) => {
    event.preventDefault(); // prevent form from submitting the traditional way
    const body = { username, password };
    const data = await logIn(body);
    if (data.error) {
      notification.set({ message: data.error, type: "error" });
    } else {
      // Process success scenario
      await fetchCollection();
      sessionStorage.setItem("username", data.username);
      sessionStorage.setItem("is_authenticated", "true");
      sessionStorage.setItem("email", data.email);
      notification.set({ message: "Welcome back!", type: "success" });
      goto("/collect/");
    }
  };
</script>

<svelte:head>
  <title>BCF | Login</title>
</svelte:head>

<div class="mx-auto max-w-[800px] xl:max-w-7xl">
  <div id="authentification" class="m-10 flex flex-col items-center p-10">
    <form
      on:submit|preventDefault={handleSubmit}
      class="flex h-[475px] w-[300px] flex-col items-start justify-start rounded-lg bg-white p-8 shadow dark:bg-stone-950"
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
        class="my-4 w-full rounded-lg border-none bg-stone-50 p-2 shadow-inner focus:ring-2 focus:ring-gold-300 dark:bg-stone-800"
        placeholder="username"
        bind:value={username}
        required
      />
      <input
        id="password-field"
        type="password"
        class="my-2 w-full rounded-lg border-none bg-stone-50 p-2 shadow-inner focus:ring-2 focus:ring-gold-300 dark:bg-stone-800"
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
  </div>
</div>
