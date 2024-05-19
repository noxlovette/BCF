<script lang="ts">
  import { goto } from "$app/navigation";
  import { logIn } from "$lib/DjangoAPI";
  import {scale, fade } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { fetchCollection } from "$lib/DjangoAPI";
  import Header from "$lib/components/Header.svelte";
  import { writable } from "svelte/store";

  let username = "";
  let password = "";
  let notification = writable("");

  const handleSubmit = async (event) => {
    event.preventDefault(); // prevent form from submitting the traditional way
    const body = { username, password };
    const data = await logIn(body);
    if (data.error) {
      console.error("Server responded with an error:", data.error);
      notification.set(data.error);
    } else {
      // Process success scenario
      await fetchCollection();
      sessionStorage.setItem("username", data.username);
      sessionStorage.setItem("is_authenticated", 'true');
      sessionStorage.setItem('email', data.email);
      notification.set("Login successful!");
      goto("/collect/");
    }
  };
</script>
<svelte:head>
  <title>BCF | Login</title>
</svelte:head>

<Header currentPage="login" notification={notification}/>

<main class="">
  
  
    <div class="mx-auto max-w-[800px] xl:max-w-7xl">
      <div id = "authentification" class="flex flex-col items-center m-10">
    
    <h1 class="text-center text-6xl xl:text-[6rem] xl:tracking-tight 2xl:text-[6.5rem] font-bold tracking-tight text-pretty"
    in:scale={{
      duration: 500,
      opacity: 0.5,
      delay: 0,
      easing: quintOut}}
    >Welcome back!</h1>
    <form on:submit|preventDefault={handleSubmit} 
    
    class= "flex flex-col justify-center items-center w-full bg-stone-50/20 dark:bg-stone-950/20 rounded-lg shadow p-4"
    in:fade={{
      duration: 500,
      delay: 500,
      easing: quintOut}}
    >
      <div id= "username" class="flex flex-col items-center justify-between">      
          <input id="username-field" type="text" class='flex  bg-stone-50/20 dark:bg-stone-950/20 p-2 w-full m-4 shadow focus:ring-amber-700/70 border-none focus:ring-2 rounded-lg' placeholder = "username" bind:value={username} required />
      </div>
      <div id= "password" class="flex flex-col items-center justify-between">
        <input id="password-field" type="password" class='flex  bg-stone-50/20 dark:bg-stone-950/20 p-2 w-full m-4 shadow focus:ring-amber-700/70 border-none focus:ring-2 rounded-lg' placeholder = "password" bind:value={password} required /> 
      </div>
      <button type="submit" class="flex m-2 hover:text-amber-400 transition-all hover:scale-110 active:scale-90">
          log in
      </button>
      <a href="/auth/signup" class= "p-2 text-xs hover:text-amber-400 transition-all hover:scale-110 active:scale-90"> don't have an account?</a>
      
      
    </form>

  </div>
</div>
  
</main>
