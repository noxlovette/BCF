<script>
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import Settings from './Settings.svelte';
    import Contributions from './Contributions.svelte';
    import HelpCentre from './HelpCentre.svelte';

    let currentPage = writable('');
    let username = "";
    let userId = "";
    let greeting = writable("");

    onMount(async () => {
        userId = sessionStorage.getItem('user_id');
        username = sessionStorage.getItem('username');

        if (!userId) {
            window.location.href = '/auth/login';
        }

        // Set the greeting based on local time
        updateGreeting();

        // Other setup code
    });

    function updateGreeting() {
        const hours = new Date().getHours();
        if (hours < 12) {
            greeting.set("Good morning");
        } else if (hours < 18) {
            greeting.set("Good afternoon");
        } else {
            greeting.set("Good evening");
        }
    }
</script>

<div id="app" class="flex flex-row rounded-lg shadow bg-stone-400/30 dark:bg-stone-800/30 items-stretch size-5/6 m-2 mt-0 p-4 lowercase font-light">
    <div id="sidebar" class="dark:bg-stone-600/50 flex flex-col w-1/6 hover:w-1/5 mr-auto rounded-lg drop-shadow p-4 transition-all duration-500">
        <h2 id="header" class="text-4xl mb-4 border-b-2 tracking-tight border-stone-400/20">{username}</h2>
        
        <ul class="text-2xl flex flex-col items-start ">
            <button class="dark:hover:bg-amber-400/80 dark:hover:text-stone-800/80 rounded-lg transition-all hover:translate-x-1 p-2" on:click={() => currentPage.set('settings')}>
                settings
            </button>
            <button class="dark:hover:bg-amber-400/80 dark:hover:text-stone-800/80 rounded-lg transition-all hover:translate-x-1 p-2" on:click={() => currentPage.set('contributions')}>
                contributions
            </button>
            <button class="dark:hover:bg-amber-400/80 dark:hover:text-stone-800/80 rounded-lg transition-all hover:translate-x-1 p-2" on:click={() => currentPage.set('help')}>
                help centre
            </button>
        </ul>
    </div>
    <div id="main-content" class="dark:bg-stone-700/20 bg-stone-100/80 flex flex-row items-start flex-1 p-4 rounded-lg shadow ml-4">
        {#if $currentPage === 'settings'}
            <Settings />
        {:else if $currentPage === 'contributions'}
            <Contributions userId={userId} />
        {:else if $currentPage === 'help'}
            <HelpCentre />
        {:else}
            <p class="font-semibold text-4xl">{$greeting}, {username}!</p>
        {/if}
    </div>
</div>
