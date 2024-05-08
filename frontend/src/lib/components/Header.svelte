<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { writable } from "svelte/store";
  import { goto } from "$app/navigation";
  import { fetchDataFromDjango } from "$lib/DjangoAPI.ts";



  let is_authenticated = false;
  let username = "";


  async function logout() {
    const url = "http://localhost:8000/api/logout/";

    try {
      const response = await fetchDataFromDjango(url, "POST", {});
      console.log("Response:", response);
      is_authenticated = false;
      sessionStorage.clear();
      window.location.href = "/";
      notification.set("Logged out successfully");

    } catch (error) {
      console.error("Failed to log out");
      notification.set("Failed to log out")
    }
  }


  let isDropdownOpen = false;
  export { is_authenticated, username, isDropdownOpen, toggleDropdown, resetCountdown, closeDropdown };
  /**
     * @type {string}
     */
   export let currentPage;
   export let notification = writable("");

  /**
     * @type {number | undefined}
     */
  let countdownTimer; // Variable to store the timer ID
  let notificationTimeout; // Variable to store the notification timeout ID
  
   
  function toggleDropdown() {
    isDropdownOpen = true;
    resetCountdown();
  }

  // Function to start the countdown timer
  function startCountdown() {
    countdownTimer = setTimeout(closeDropdown, 3000);
  }

  // Function to reset the countdown timer
  function resetCountdown() {
    clearTimeout(countdownTimer); // Clear the existing countdown timer
    startCountdown(); // Start a new countdown timer
  }

  // Function to close the dropdown menu
  function closeDropdown() {
    isDropdownOpen = false;
  }

  /**
 * @param {string} newNotification
 */
function updateNotification(newNotification) {
  clearTimeout(notificationTimeout); // Clear any existing timeout

  notification.set(newNotification);

  // Set a new timeout to clear the notification after 3 seconds
  notificationTimeout = setTimeout(() => {
    notification.set('');
  }, 3000);
}

$: {
  updateNotification($notification);
}

  onMount(() => {
    is_authenticated = sessionStorage.getItem("is_authenticated") === "true";
    username = sessionStorage.getItem("username") || "";
  });

</script>

<header class="flex h-20 m-4 ">
  <a href="/" class="size-20 flex-none z-15" 
  on:mouseenter={toggleDropdown}>
    <img
      id="logo"
      class="size-20 shadow-lg z-15"
      src="/assets/img/bcf_logo_dark.png"
      alt="Go to home page"
    />
  </a>
  <div class= "flex-col h-full w-full">
    <div id="wider-part" class="flex flex-grow h-2/3 border-b-2 border-stone-400/10 dark:border-stone-100/10 shadow">
      {#if currentPage === "browse"}
            <p class="m-2 text-3xl text-light text-sky-950/80 dark:text-sky-50/80">browse</p>
          {:else if currentPage === "home"}
            <p class="m-2 text-3xl text-light ">BCF</p>
            {:else if currentPage === "login"}
            <p class="m-2 text-3xl text-light ">login</p>
            {:else if currentPage === "collect"}
            <p class="m-2 text-3xl text-light text-rose-950/80 dark:text-rose-50/80">collect</p>
            {:else if currentPage === "formulate"}
            <p class="m-2 text-3xl text-light text-lime-950/80 dark:text-lime-50/80">formulate</p>
            {:else if currentPage === "signup"}
            <p class="m-2 text-3xl text-light">sign up</p>
            {:else if currentPage === "profile"}
            <p class="m-2 text-3xl text-light">profile</p>
            {:else if currentPage === "paperwork"}
            <p class="m-2 text-3xl text-light">paperwork</p>
          {:else}
            <p class="m-2 text-3xl text-light">page not found</p>
        {/if}

        {#if $notification}
          <div class="ml-auto mr-10 content-center font-light lowercase"
          transition:fade={{duration: 150}}       
          >
            <p class = "">
              {$notification}
            </p>
          </div>
        {/if}

        <div id="user" class="flex flex-row ml-auto mt-auto mb-auto space-x-4">
            
          
          
          {#if is_authenticated}
          
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
          
      
            <a href="/profile" class="dark:hover:text-amber-300/90 hover:text-amber-900/90 transition-all" >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              
              
            </a>
            <button on:click={logout} class="dark:hover:text-amber-300/90 hover:text-amber-900/90 transition-all" >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
              </svg>   
            </button>
          {:else}
            <a href="/auth/login" class=" dark:hover:text-amber-300/90 hover:text-amber-900/90 transition-all" >login</a>
            <a href="/auth/signup" class=" dark:hover:text-amber-300/90 hover:text-amber-900/90 transition-all" >sign up</a>
          {/if}
        </div>
    </div>
    <div id="narrower-part" class="ml-2 flex flex-shrink h-1/3">
      <nav id="navbar" class="flex flex-row items-center justify-between">
        <div
          class="relative"
          on:mouseleave={resetCountdown}
          role="button"
          tabindex="0"
        >
          <!-- Dropdown menu -->
          
          {#if isDropdownOpen}
            <div
              transition:fade={{ delay: 250, duration: 500 }}
              on:mouseleave={resetCountdown}
              role="button"
              tabindex="0"
              class="flex flex-row z-10"
            >
              <ul class= "flex space-x-5">
                <li class="hover:text-sky-300/80 transition-all">
                  <a href="/browse"
                  >
                    browse
                  </a>
                </li>
                <li class=" hover:text-pink-400/80 transition-all">
                  <a href="/collect" 
                  >collect</a>
                </li>
                <li class=" hover:text-lime-500/80 transition-all">
                  <a href="/formulate" 
                  >formulate</a>
                </li>
              </ul>
            </div>
          {/if}
        </div>
      </nav>
    </div>
  </div>

  
</header>

<style>
  
</style>
