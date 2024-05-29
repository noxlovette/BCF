<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import Settings from './Settings.svelte';
    import Contributions from './Contributions.svelte';

    import { goto } from "$app/navigation";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Quote from "./Quote.svelte";
    
    
    let username = "";
    let email = "";
    let currentPage = writable('');
    let is_authenticated = false;
    let greeting = writable("");
    export let notification = writable('');

    onMount(async () => {
        is_authenticated = Boolean(sessionStorage.getItem('is_authenticated'));
        username = sessionStorage.getItem('username');
        email = sessionStorage.getItem('email');
        if (!is_authenticated) {
        goto(`/auth/login`);
        }
        
        // Set the greeting based on local time
        updateGreeting();

        // Other setup code
    });

    function updateGreeting() {
        const hours = new Date().getHours();
        if (hours < 12) {
            greeting.set("morning");
        } else if (hours < 18) {
            greeting.set("afternoon");
        } else {
            greeting.set("evening");
        }
    }

    let quotes = [
      "Perfume is the art that makes memory speak. — Francis Kurkdjian",
      "A woman who doesn't wear perfume has no future. — Coco Chanel",
      "Perfume is the key to our memories. — Kate Lord Brown",
      "...the fragrance of goodness travels with us through all the worlds... — Buddha",
    "No elegance is possible without perfume. It is the unseen, unforgettable, ultimate accessory. — Coco Chanel",
    "Perfume is a way of stopping time. You smell a beautiful scent and you remember something. — Isabel Toledo",
    "Perfume is like a new dress, it makes you quite simply marvelous. — Estée Lauder",
    "Where should one use perfume? a young woman asked. Wherever one wants to be kissed. — Coco Chanel",
    "A good fragrance is really a powerful cocktail of memories and emotion. — Jeffrey Stepakoff",
    "Perfume is the indispensable complement to the personality of women, the finishing touch on a dress. — Christian Dior",
    "Perfume follows you; it chases you and lingers behind you. It's a reference mark. Perfume makes silence talk. — Sonia Rykiel",
    "Long after one has forgotten what a woman wore, the memory of her perfume lingers. — Christian Dior",
    "Perfume is the most intense form of memory. — Jean Paul Guerlain",
    "You are never fully dressed without perfume! — C. JoyBell C.",
    "The best things in life are unseen, that's why we close our eyes when we kiss, cry, and dream. — Helen Keller",
    "Only a few find the way, some don't recognize it when they do – some… don't ever want to.",
    "Then you'll see, that it is not the spoon that bends, it is only yourself",
    "...sooner or later you're going to realize just as I did that there's a difference between knowing the path and walking the path.",
    ];
    let chosenQuote = getRandomQuote();
  
  function getRandomQuote() {
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
</script>

<svelte:head>
  <title>BCF | Profile</title>
</svelte:head>
<div class="flex flex-col min-h-screen z-0">
    <Header currentPage="profile" notification={notification}/>
    <div class="mb-auto flex justify-center items-center">
    
<div id="app" class="flex flex-col md:flex-row p-4 xl:p-8 md:mx-4 xl:my-8 w-[400px] md:w-[720px] lg:w-[960px] xl:w-[1200px]">
    <div id="sidebar" class="dark:bg-stone-800 rounded-lg drop-shadow p-4 transition-all text-left justify-start flex flex-col mb-4 md:mb-0">
        <h2 id="header" class="mb-4 border-b-2 tracking-tight border-stone-400 p-2">{username}</h2>
        <ul class="flex flex-col items-start justify-start *:font-bold">
            <button class="hover:bg-amber-400 dark:hover:text-stone-800 rounded-lg transition-all hover:translate-x-1 p-2" on:mousedown={() => currentPage.set('settings')}>
                settings
            </button>
            <button class="hover:bg-amber-400 dark:hover:text-stone-800 rounded-lg transition-all hover:translate-x-1 p-2" on:mousedown={() => currentPage.set('contributions')}>
                contributions
            </button>
        </ul>
    </div>
    <div id="main-content" class="dark:bg-stone-700 bg-stone-200 flex flex-row items-center justify-start flex-1 p-8 rounded-lg shadow md:ml-4">
        {#if $currentPage === 'settings'}
            <Settings bind:notification {email} {username} />
        {:else if $currentPage === 'contributions'}
            <Contributions />
            {:else}
        <div class="m-4 bg-white dark:bg-stone-800 p-4 rounded-lg shadow">
            <p class="text-xl tracking-tight font-bold">Good <span class="text-amber-400">{$greeting},</span> {username}!</p>
            <div id="aussage" class="flex flex-row mt-8">
<span class="dark:text-white"><Quote /></span>
            <p class="italic text-pretty py-8">{chosenQuote}</p>
            <span class="rotate-180"><Quote /></span>
        </div>
          </div>
        {/if}
    </div>
</div>
</div>
<Footer/>
</div>