<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import Settings from "./Settings.svelte";
  import Contributions from "./Contributions.svelte";

  import { goto } from "$app/navigation";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Quote from "./Quote.svelte";
  import { notification } from "$lib/stores/notificationStore";

  let username = "";
  let email = "";
  let currentPage = writable("");
  let is_authenticated = false;
  let greeting = writable("");

  onMount(async () => {
    is_authenticated = Boolean(sessionStorage.getItem("is_authenticated"));
    username = sessionStorage.getItem("username");
    email = sessionStorage.getItem("email");
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

<div
  id="app"
  class="flex w-[400px] flex-col p-4 md:mx-4 md:w-[720px] md:flex-row lg:w-[960px] xl:my-8 xl:w-[1200px] xl:p-8"
>
  <div
    id="sidebar"
    class="mb-4 flex flex-col justify-start rounded-lg p-4 text-left drop-shadow transition-all md:mb-0 dark:bg-stone-800"
  >
    <h2 id="header" class="mb-4 border-b-2 border-stone-400 p-2 tracking-tight">
      {username}
    </h2>
    <ul class="flex flex-col items-start justify-start *:font-bold">
      <button
        class="rounded-lg p-2 transition-all hover:translate-x-1 hover:bg-gold-400 dark:hover:text-stone-800"
        on:mousedown={() => currentPage.set("settings")}
      >
        settings
      </button>
      <button
        class="rounded-lg p-2 transition-all hover:translate-x-1 hover:bg-gold-400 dark:hover:text-stone-800"
        on:mousedown={() => currentPage.set("contributions")}
      >
        contributions
      </button>
    </ul>
  </div>
  <div
    id="main-content"
    class="flex flex-1 flex-row items-center justify-start rounded-lg bg-stone-200 p-8 shadow md:ml-4 dark:bg-stone-700"
  >
    {#if $currentPage === "settings"}
      <Settings {email} {username} />
    {:else if $currentPage === "contributions"}
      <Contributions />
    {:else}
      <div class="m-4 rounded-lg bg-white p-4 shadow dark:bg-stone-800">
        <p class="text-xl font-bold tracking-tight">
          Good <span class="text-gold-400">{$greeting},</span>
          {username}!
        </p>
        <div id="aussage" class="mt-8 flex flex-row">
          <span class="dark:text-white"><Quote /></span>
          <p class="text-pretty py-8 italic">{chosenQuote}</p>
          <span class="rotate-180"><Quote /></span>
        </div>
      </div>
    {/if}
  </div>
</div>
