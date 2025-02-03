<script>
  import { fade } from "svelte/transition";
  import { onDestroy } from "svelte";
  import { Loader, Loader2 } from "lucide-svelte";

  import { navigating } from "$app/stores";

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

  let counter = 0;
  let intervalId = null;

  $: {
    if ($navigating) {
      if (intervalId === null) {
        // Ensure interval is set only once
        intervalId = setInterval(() => {
          counter += 1;
        }, 300);
      }
    } else {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }
  }

  onDestroy(() => {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
  });
</script>

{#if $navigating && counter > 1}
  <div
    class="bg-opacity-40 fixed top-0 left-0 z-30 flex h-full w-full items-center justify-center bg-stone-950 backdrop-blur"
    transition:fade={{ duration: 300 }}
  >
    <div class="relative flex max-w-[400px] flex-col space-y-2">
      <Loader2 class="animate-spin"></Loader2>
      <p
        class="text-gold-50 px-4 font-bold text-pretty normal-case italic lg:text-2xl"
      >
        {chosenQuote}
      </p>
    </div>
  </div>
{/if}
