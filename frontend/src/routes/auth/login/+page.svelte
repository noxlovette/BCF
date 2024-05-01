<script>
  import { goto } from "$app/navigation";
  import { fetchDataFromDjango } from "$lib/DjangoAPI.ts";
  import Header from "$lib/components/Header.svelte";
  import { writable } from "svelte/store";

  let username = "";
  let password = "";
  let notification = writable("");

  const handleSubmit = async () => {
    try {
      const url = "http://localhost:8000/api/login/";
      let body = {
        username: username,
        password: password,
      };
      const data = await fetchDataFromDjango(url, "POST", body);

      if (data.error) {
        console.error("Server responded with an error:", data.error);
        notification.set("Login failed...")
      } else {
        sessionStorage.setItem("user_id", data.user_id);
        sessionStorage.setItem("username", data.username);
        sessionStorage.setItem("is_authenticated", data.is_authenticated);
        notification.set("Login successful!")
        
        goto("/collect/");
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
  };
</script>

<Header currentPage="login" notification={notification}/>

<main class="lowercase">
  <div id = "authentification" class="flex flex-auto items-center justify-center m-10 p-2">
    <form on:submit|preventDefault={handleSubmit} class= "flex flex-col justify-start w-1/2">
      <div id= "username">
        <label for="username-field" class="p-2 pl-0">Username:</label>
      <input id="username-field" type="text" class= "w-full p-2 bg-white/20" bind:value={username} required />

      </div>
      <div id= "password">
        <label for="password-field" class="p-2 pl-0">Password:</label>
        <input id="password-field" type="password" class="w-full p-2 bg-white/20" bind:value={password} required />
      </div>
      <button type="submit" class="pt-2 hover:text-amber-900">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
        </svg>
        

      </button>
      
    </form>
  </div>
  
</main>
