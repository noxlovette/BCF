<script>
import { isLoading } from "$lib/stores/loadingStore";
import {fade} from "svelte/transition";

let loadingState;

$: loadingState = $isLoading;

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

{#if loadingState}
<div class="loading-overlay" transition:fade>
    <div class="flex size-full flex-col items-center">
      <div
        id="spinner"
        class="m-10 flex size-24 animate-spin rounded-full border-8 border-dotted border-gold-400"
      />
      <p class="text-pretty text-center text-2xl font-bold normal-case">
        {chosenQuote}
      </p>
    </div>
  </div>
{/if}

<style>
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5); /* semi-transparent overlay */
    z-index: 9999;
  }
  </style>