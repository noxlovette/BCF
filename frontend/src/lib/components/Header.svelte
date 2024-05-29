<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { writable } from "svelte/store";
  import { fetchCentralDjangoApi } from "$lib/DjangoAPI";
    import InformationIcon from "$lib/icons/InformationIcon.svelte";

  let is_authenticated = false;
  let username = "";

  async function logout() {
    const url = "http://localhost:8000/api/logout/";

    try {
      const response = await fetchCentralDjangoApi(url, "POST", {});
      
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
    username = sessionStorage.getItem("username") || "stranger";
  });
  
  

</script>


<header class="relative flex flex-col items-center justify-center py-4 z-20 group ">
  <div class="flex w-full max-w-7xl items-center justify-center px-4 ">
    <a href="/" class="size-16 md:size-20 flex-none z-15 transition-all items-center justify-center" on:mouseenter={toggleDropdown}>
      <img
        id="logo"
        class="size-16 md:size-20 z-50"
        src="/assets/img/bcf_logo_dark.png"
        alt="Go to home page"
      />
    </a>
    <div class="flex-col size-full justify-center ml-2">
    <div id="wider-part" class="flex flex-grow h-2/3 border-b border-stone-400/50 dark:border-stone-100/50">
      {#if currentPage}
          <p on:mouseenter={toggleDropdown} class="m-2 text-3xl font-light tracking-tighter ">{currentPage}</p>
          
        {/if}

        {#if $notification}
          <div class="mx-auto content-center font-normal lowercase z-50"
          out:fade={{duration: 150}}
          >
            <p class = "text-xs sm:text-sm md:text-base">
              {$notification}
            </p>
          </div>
        {/if}

        <div id="user" class="flex flex-row ml-auto mt-auto mb-auto space-x-4 items-center justify-center">
          {#if is_authenticated}
          <a href="https://docs.bcfapp.app" title="learn to use BCF" class=" hover:text-amber-300 transition-all">
          <InformationIcon />
        </a>
          
      
            <a id="profile" href="/profile" aria-label={username} title="{username}'s profile" class="hover:text-amber-300 transition-all" >
              <svg   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              
              
            </a>
            <button id="logout" on:mousedown={logout} title="log out" class="hover:text-amber-300 transition-all" >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
              </svg>   
            </button>
          {:else}
            <a href="/auth/login" class=" hover:text-amber-300 transition-all" >login</a>
            <a href="/auth/signup" class=" hover:bg-stone-50 hover:text-amber-300 transition-all rounded-lg shadow bg-amber-300 text-stone-900 p-2" >sign up</a>
          {/if}
        </div>
    </div>
    <div id="narrower-part" class="ml-2 flex flex-shrink h-1/3 transition-all" role="banner" >
      <nav id="navbar" class="flex flex-row mt-2" on:mouseenter={toggleDropdown}>
            <!-- Permanent placeholder or minimal content -->
            
          {#if isDropdownOpen}
            <div
              in:fade={{ duration: 500 }}
              out:fade={{ duration: 200 }}
              on:mouseleave={resetCountdown}
              role="button"
              tabindex="0"
              class="z-10"
            >
              <ul class= "flex space-x-5">
                <li class="hover:text-sky-700 transition-all">
                  <a href="/browse"
                  >
                    browse
                  </a>
                </li>
                <li class=" hover:text-pink-700 transition-all">
                  <a href="/collect" 
                  >collect</a>
                </li>
                <li class=" hover:text-lime-700 transition-all">
                  <a href="/formulate" 
                  >formulate</a>
                </li>
              </ul>
            </div>
          {:else}
          <div class="space-x-5">
            <span class="invisible">Placeholder</span>
          </div>
          {/if}
      </nav>
    </div>
  </div>

</div>
</header>

<style>
  
</style>
