<script>
    import { onMount } from "svelte";
    
    export let colour = "amber";

onMount(() => {
  console.log("Component mounted");
  console.log("Colour loader:", colour);
});
let quotes = [
      "Perfume is the art that makes memory speak. — Francis Kurkdjian",
      "A woman who doesn't wear perfume has no future. — Coco Chanel",
      "Perfume is the key to our memories. — Kate Lord Brown",
      "The perfume of sandalwood, the scent of rose bay and jasmine travel only as far as the wind. But the fragrance of goodness travels with us through all the worlds. Like the garlands woven from a heap of flowers, fashion your life as a garland of beautiful deeds. — Buddha",
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
    ];
    let chosenQuote = getRandomQuote();
  
  function getRandomQuote() {
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

</script>

<div id="spinner" class="flex size-16 border-4 m-10 border-{colour}-800 border-dotted rounded-full animate-spin" />
<p>{chosenQuote}</p>
  
  
  