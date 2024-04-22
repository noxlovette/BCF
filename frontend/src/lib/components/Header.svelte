<script>
    import {onMount} from 'svelte';
    import {fade} from 'svelte/transition';
    import {scale} from 'svelte/transition';

    let is_authenticated = false;
    let username = '';
    let isDropdownOpen = false;
    let countdownTimer; // Variable to store the timer ID
    export let currentPage;

    function toggleDropdown() {
        isDropdownOpen = true;
        resetCountdown();
    }

    // Function to start the countdown timer
    function startCountdown() {
        countdownTimer = setTimeout(closeDropdown, 2000);
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

    onMount(() => {
        is_authenticated = sessionStorage.getItem('is_authenticated') === 'true';
        username = sessionStorage.getItem('username') || '';
    });
</script>

<header class="mb-1.5 flex z-1000 p-2 items-center justify-between">
    <nav id="navbar" class="flex items-center justify-between font-thin text-2xl">
        <div class="relative" on:mouseleave={resetCountdown} role="button" tabindex="0">
            <a href="/" on:mouseenter={toggleDropdown}>
                <img id="logo" class="size-20" src="/assets/img/bcf_logo_dark.png" alt="Go to home page">
            </a>
            {#if currentPage === 'browse'}
                <p class="text-6xl font-thin text-gray-800">Browse</p>
            {/if}
            {#if isDropdownOpen}
                <div transition:fade="{{delay:250, duration: 500}}" on:mouseleave={resetCountdown} role="button"
                     tabindex="0" class="absolute left-1 mt-2 bg-amber-50 border rounded shadow-lg z-10">
                    <ul>
                        <li>
                            <a class="button"
                               href="/browse">Browse</a></li>
                        <li>
                            <a class="button">Collect</a>
                        </li>
                        <li>
                            <a class="button">Formulate</a>
                        </li>
                    </ul>
                </div>
            {/if}
        </div>
    </nav>

    <div id="authentication" class="flex ml-auto">
        {#if is_authenticated}
            <a href="/profile" class="text-gray-800 hover:text-gray-600 m-2 text-sm flex items-center">
                <span class="material-icons pr-1.5">account_circle</span>
                <span>{username}</span>
            </a>
        {:else}
            <a href="/login" class="text-gray-800 hover:text-gray-600 ml-2 text-sm flex items-center">
                <span class="material-icons">login</span>
                <span>Login</span>
            </a>
        {/if}
    </div>
</header>

<style>
    .button {
        @apply block px-4 py-2 text-gray-800;
        transition: background-color 0.5s ease, transform 0.5s ease;
    }

    .button:hover {
        @apply bg-amber-100;
        transform: scale(1.2);
    }
</style>
