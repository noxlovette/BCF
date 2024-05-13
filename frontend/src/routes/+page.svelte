<script lang="ts">
  import { onMount } from "svelte";
  import { scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  import Header from "$lib/components/Header.svelte";
  import { writable } from "svelte/store";
   import Footer from "$lib/components/Footer.svelte";



  let notification = writable("");
  let randomPhrase = writable("");

  let isMounted = false;
  

  const funnyPhrases = [
  "Why was the math book sad? Because it had too many problems.",
  "Why couldn't the bicycle stand up by itself? It was two-tired.",
  "I told my wife she was drawing her eyebrows too high. She looked surprised.",
  "Why don't scientists trust atoms? Because they make up everything!",
  "What did the ocean say to the shore? Nothing, it just waved.",
  "Why did the scarecrow win an award? Because he was outstanding in his field.",
  "Why did the tomato turn red? Because it saw the salad dressing!",
  "How does a penguin build its house? Igloos it together.",
  "What do computers like to eat? Chips!",
  "Why did the golfer bring two pairs of pants? In case he got a hole in one.",
  "Why did the coffee file a police report? It got mugged.",



  // Add more funny phrases as needed
];


    /**
     * @param {string | any[]} array
     */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}



function updateNotification() {
  shuffleArray(funnyPhrases);
  randomPhrase.set(funnyPhrases[0]); // Get the first phrase from the shuffled array
  notification.set($randomPhrase); // Update the notification value
}

    /**
     * @type {number | undefined}
     */
let notificationInterval;

function startNotificationInterval() {
  notificationInterval = setInterval(updateNotification, 7000); // Update every 5 seconds
}

  onMount(() => {
    console.log("mounted");
    isMounted = true;
    setTimeout(startNotificationInterval, 1000000);
  });

  




</script>
<div class="min-h-screen min-w-screen" style="background: url('/assets/bg/bbblurry-main.svg') no-repeat center center fixed; background-size: cover;">

  <Header 
    currentPage="BCF" 
    notification={notification}  
  />
  <div class="mb-auto">  
    
    <div class="py-12 sm:py-8 md:py-12 lg:py-14 xl:py-12 2xl:py-28">
    <div class="lg:px-8">
      <div class="flex flex-col items-center"> 
    <div class= "mx-auto max-w-[800px] xl:max-w-7xl">
    <div class= "max-w-md px-4 sm:max-w-2xl sm:px-6 md:max-w-3xl lg:max-w-4xl lg:px-0 xl:max-w-5xl 2xl:max-w-6x1">
    <div class="flex w-full flex-col items-center gap-4">
      <div class="flex flex-col items-start justify-between">
      <div id = "big text"class="">
        <h1
          class="text-center text-6xl xl:text-[6rem] xl:tracking-tight 2xl:text-[6.5rem] font-bold tracking-tight text-pretty"
          in:scale={{
            duration: 500,
            delay: 0,
            opacity: 0.5,
            start: 0.5,
          }}
        >
        Want to create your own
        <span class="text-amber-300">
        perfume? 
      </span>
        We've got you covered. YES IT WORKS!
        </h1>
      </div>
    </div>
    </div>
  </div>
</div>

    </div>
    </div>

    <div class="py-12 sm:py-8 md:py-12 lg:py-14 xl:py-12 2xl:py-28"
    in:fade={{duration: 500, delay: 1000}}
    >
      <section id="browse" class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 pb-12 sm:px-6 lg:grid lg:gap-x-8 lg:px-8 xl:grid-cols-2 xl:gap-x-12 py-8 md:py-16 lg:py-24 text-pretty">
        <div class="mx-auto flex max-w-[800px] flex-col gap-2 md:gap-4 xl:max-w-full">
          <h2 class="mb-2 w-full text-3xl font-bold text-sky-950 md:text-5xl lg:text-5xl">
            Browse over 3100 ingredients.
          </h2>
          <p class="mx-auto mt-4 max-w-3xl text-base text-sky-700 md:text-xl lg:text-xl xl:text-xl">
            Use the power of IFRA's FIG in an unprecedented way. The whole Browse page is supercharged with the community's input and the structure of the Association.
          </p>
          <p class="mx-auto mt-4 max-w-3xl text-base text-sky-700 md:text-xl lg:text-xl xl:text-xl">
            Industry-level data, supported by the opinions of real perfumers.
          </p>
          <p class="mx-auto mt-4 max-w-3xl text-base text-sky-700 md:text-xl lg:text-xl xl:text-xl">
            This is the place where the hidden becomes apparent, and your expertise grows. <b>You contribute</b>, and you <b>benefit</b>.
          </p>
        </div>
        <div class="min-h-[300px] md:min-h-[400px]"> 
          <img
            src="/assets/img/dalle-browse-4.webp"
            alt="A collection of ingredients"
            class="w-full h-full object-cover rounded-lg shadow-lg"
            in:fade={{
              duration: 500,
              delay: 1000
            }}
          />
        </div>
      </section>

      <section id="collect" class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 pb-12 sm:px-6 lg:grid lg:gap-x-8 lg:px-8 xl:grid-cols-2 xl:gap-x-12 py-8 md:py-16 lg:py-24 text-pretty">
        <div class="min-h-[300px] md:min-h-[400px]"> 
          <img
            src="/assets/img/dalle-collect-1.webp"
            alt="A collection of ingredients"
            class="w-full h-full object-cover rounded-lg shadow-lg"
            in:fade={{
              duration: 500,
              delay: 1500
            }}
          />
        </div>
        <div class="mx-auto flex max-w-[800px] flex-col gap-2 md:gap-4 xl:max-w-full">
          <h2 class="mb-2 w-full text-3xl font-bold text-rose-950 md:text-5xl lg:text-5xl">
            Collect hundreds of perfume compounds.
          </h2>
          <p class="mx-auto mt-4 max-w-3xl text-base text-rose-700 md:text-xl lg:text-xl xl:text-xl">
            Keep track of your favourite ingredients and the ones you want to try.
          </p>
          <p class="mx-auto mt-4 max-w-3xl text-base text-rose-700 md:text-xl lg:text-xl xl:text-xl">
            Note down ideas, associations, and inspirations. Everything from colour to availability in your lab.
          </p>
          <p class="mx-auto mt-4 max-w-3xl text-base text-rose-700 md:text-xl lg:text-xl xl:text-xl">
            Your collection is your world only. <b>Encrypted, it is only yours to enjoy.</b>
          </p>
        </div>
        
      </section>

      <section id="browse" class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 pb-12 sm:px-6 lg:grid lg:gap-x-8 lg:px-8 xl:grid-cols-2 xl:gap-x-12 py-8 md:py-16 lg:py-24 text-pretty">
        <div class="mx-auto flex max-w-[800px] flex-col gap-2 md:gap-4 xl:max-w-full">
          <h2 class="mb-2 w-full text-3xl font-bold text-lime-950 md:text-5xl lg:text-5xl">
            Formulate a revolution.
          </h2>
          <p class="mx-auto mt-4 max-w-3xl text-base text-lime-700 md:text-xl lg:text-xl xl:text-xl">
            Manage your formulas independent of where you are. At home, in the lab, or on holiday.
          </p>
          <p class="mx-auto mt-4 max-w-3xl text-base text-lime-700 md:text-xl lg:text-xl xl:text-xl">
            Focus on how to make your ideas come true, and not on where to store them.
          </p>
          <p class="mx-auto mt-4 max-w-3xl text-base text-lime-700 md:text-xl lg:text-xl xl:text-xl">
            Make a difference. <b>Change</b> the landscape of <b> perfumery today.</b>
          </p>
        </div>
        <div class="min-h-[300px] md:min-h-[400px]"> 
          <img
            src="/assets/img/dalle-formulate-1.webp"
            alt="A collection of ingredients"
            class="w-full h-full object-cover rounded-lg shadow-lg"
            in:fade={{
              duration: 500,
              delay: 1500
            }}
          />
        </div>
      </section>

    </div>
    <div class="lg:px-8 lg:py-8">
      <div class="flex flex-col items-center"> 
    <div class= "mx-auto max-w-[800px] xl:max-w-7xl">
    <div class= "max-w-md px-4 sm:max-w-2xl sm:px-6 md:max-w-3xl lg:max-w-4xl lg:px-0 xl:max-w-5xl 2xl:max-w-6x1">
    <div class="flex w-full flex-col items-center gap-4">
      <div class="flex flex-col items-start justify-between">
        
    <div
    id="buttons"
    class="text-center text-6xl xl:text-[6rem] xl:tracking-tight 2xl:text-[6.5rem] font-bold tracking-tight text-pretty" 
    style="width: 100%;" 
    in:fade={{duration: 500, delay: 2500}}>
    <a href="/browse" class="button hover:text-sky-300/80 transition-all px-6 py-3">browse</a>
    <a href="/collect" class="button hover:text-pink-400/80 transition-all px-6 py-3">collect</a>
    <a href="/formulate" class="button hover:text-lime-500/80 transition-all px-6 py-3">formulate</a>
    <a href="/auth/signup" class="button text-amber-400/80 hover:text-amber-600/80 transition-all px-6 py-3">sign up</a>
  </div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

</div>
  <Footer />
</div>



<style>

</style>
