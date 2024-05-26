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
      <div id = "authentification" class="flex flex-col items-center m-10 p-10">
        

    <form on:submit|preventDefault={handleSubmit} 
    
    
    class= "flex flex-col h-[475px] w-[300px] justify-start items-start bg-white dark:bg-stone-950 rounded-lg shadow p-8"
    in:fade={{
      duration: 100,
      easing: quintOut}}>
      <h1 class="text-6xl mb-8 border-b-2 font-bold tracking-tighter">sign in<span class="text-amber-300">.</span></h1>

        <input id="username-field" type="text" class='w-full p-2 my-4 bg-stone-50 shadow-inner focus:ring-amber-300 border-none focus:ring-2 rounded-lg' placeholder = "username" bind:value={username} required />
        <input id="password-field" type="password" class='w-full p-2 my-2 bg-stone-50 shadow-inner focus:ring-amber-300 border-none focus:ring-2 rounded-lg' placeholder = "password" bind:value={password} required /> 
      <button type="submit" class="text-4xl font-bold tracking-tighter hover:text-amber-400 transition-all active:scale-90">
          go
      </button>
      <a href="/auth/signup" class= "flex text-sm mt-auto opacity-60 hover:text-amber-400 hover:opacity-100 transition-all"> don't have an account?</a>
      
      
    </form>

  </div>
</div>
  
</main>
