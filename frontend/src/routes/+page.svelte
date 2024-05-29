<script lang="ts">
  import { onMount } from "svelte";
  import BigText from "$lib/components/BigText.svelte";
  import { fade } from "svelte/transition";
  import Header from "$lib/components/Header.svelte";
  import { writable } from "svelte/store";
   import Footer from "$lib/components/Footer.svelte";
   import {goto} from "$app/navigation";

  const bigText = `Want to create your own <span class="text-amber-300"> perfume? </span>We've got you covered<span class="text-amber-300">.</span>`

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
    
    isMounted = true;
    setTimeout(startNotificationInterval, 1000000);
  });

  




</script>

<svelte:head>
  <title>BCF</title>
</svelte:head>
<div class="min-h-screen w-screen" style="">

  <Header 
    currentPage="BCF" 
    notification={notification}  
  />
  <div class="mb-auto">
    <div class="flex flex-col py-12 sm:py-8 md:py-12 2xl:py-28 justify-center items-center">


    <BigText text = {bigText} />
    
    
    <div id="blabla" class="flex flex-col justify-center items-center my-8 py-4 md:py-8 2xl:py-16 max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl"
    in:fade={{duration: 300, delay: 300}}
    >
    <section id="browse" class="mx-auto aspect-[16/9] w-full h-[600px] rounded-lg grid grid-cols-1 bg-cover bg-center justify-center items-center gap-8 px-4 py-8 pb-12 sm:px-6 lg:grid-cols-2 lg:gap-x-8 lg:px-8 xl:gap-x-12 md:py-16 lg:py-24 text-pretty" 
    style="background-image: url('/assets/img/dalle-browse-4.webp')">
    <div class="hidden lg:block lg:col-span-1">
      <!-- Empty on large screens to maintain grid layout -->
    </div>
    <div class="flex flex-col justify-center items-center text-center lg:text-left backdrop-blur-lg bg-white/70 dark:bg-stone-900/70 p-8 lg:p-12 rounded-lg hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg transition-all group">
      <a href="/browse" class="z-10">
        <h2 class="text-3xl font-bold group-hover:text-sky-700 group-hover:dark:text-sky-400 md:text-3xl lg:text-4xl mb-4">
          Browse over 3100 ingredients.
        </h2>
      </a>
      <p class="group-hover:text-sky-800 group-hover:dark:text-sky-200 md:text-lg lg:text-xl xl:text-2xl max-w-2xl">
        Use the power of IFRA's FIG in an unprecedented way. Industry-level data, supported by the opinions of real perfumers.
        This is the place where the hidden becomes apparent, and your expertise grows. <b>You contribute</b>, and you <b>benefit</b>.
      </p>
    </div>
      
    </section>
    

    
    <section id="browse" class="mx-auto aspect-[16/9] my-12 w-full h-[600px] rounded-lg grid grid-cols-1 bg-cover bg-center items-center gap-8 px-4 py-8 pb-12 sm:px-6 lg:grid-cols-2 lg:gap-x-8 lg:px-8 xl:gap-x-12 md:py-16 lg:py-24 text-pretty" 
    style="background-image: url('/assets/img/dalle-collect-1.webp')">
        
    <div class="flex flex-col justify-center items-center text-center lg:text-right backdrop-blur-lg bg-white/70 dark:bg-stone-900/70 p-8 lg:p-12 rounded-lg group hover:bg-white dark:hover:bg-stone-800 hover:shadow-lg transition-all group">
          <a href="/collect">
          <h2 class="text-3xl font-bold group-hover:text-rose-700 group-hover:dark:text-rose-400 md:text-3xl lg:text-4xl mb-4">
            Collect hundreds of compounds.
          </h2>
        </a>
          <p class="md:text-lg lg:text-xl xl:text-2xl max-w-2xl group-hover:text-rose-800 group-hover:dark:text-rose-200 ">
            Keep track of your favourite ingredients and the ones you want to try.
            Note down ideas, associations, and inspirations. Everything from colour to availability in your lab.
            Your collection is your world only. <b>Encrypted, it is only yours to enjoy.</b>
          </p>
        </div>
        <div class="hidden lg:block lg:col-span-1">
          <!-- Empty on large screens to maintain grid layout -->
        </div>
        
      </section>


      <section id="formulate" class="mx-auto aspect-[16/9] my-12 w-full h-[600px] rounded-lg grid grid-cols-1 bg-cover bg-center items-center gap-8 px-4 py-8 pb-12 sm:px-6 lg:grid-cols-2 lg:gap-x-8 lg:px-8 xl:gap-x-12 md:py-16 lg:py-24 text-pretty" 
    style="background-image: url('/assets/img/dalle-formulate-1.webp')">
    
    <div class="flex flex-col justify-center items-center text-center lg:text-right backdrop-blur-lg bg-white/70 dark:bg-stone-900/70 p-8 lg:p-12 rounded-lg hover:bg-white dark:hover:bg-neutral-800 hover:shadow-lg transition-all group">
          <a href="/formulate">
          <h2 class="mb-4 w-full text-3xl font-bold group-hover:text-lime-700 group-hover:dark:text-lime-400 md:text-3xl lg:text-4xl">
            Formulate a revolution.
          </h2>
        </a>
          <p class="md:text-lg lg:text-xl xl:text-2xl max-w-2xl group-hover:text-lime-800 group-hover:dark:text-lime-200">
            Manage your formulas independent of where you are. At home, in the lab, or on holiday.
            Focus on how to make your ideas come true, and not on where to store them.
            Make a difference. <b>Change</b> the landscape of <b> perfumery today.</b>
          </p>
        </div>
        <div class="hidden lg:block lg:col-span-1">
          <!-- Empty on large screens to maintain grid layout -->
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
    class="text-center flex flex-col text-6xl xl:text-[6rem] xl:tracking-tight 2xl:text-[6.5rem] font-bold tracking-tight text-pretty" 
    style="width: 100%;" 
    in:fade={{duration: 500, delay: 2500}}>
    <div class="flex xl:flex-row flex-col">
    <a href="/browse" class="button hover:text-sky-300/80 transition-all px-6 py-3">browse</a>
    <a href="/collect" class="button hover:text-pink-400/80 transition-all px-6 py-3">collect</a>
    <a href="/formulate" class="button hover:text-lime-500/80 transition-all px-6 py-3">formulate</a>
  </div>
    <a href="/auth/signup" class="button text-amber-400/80 hover:text-amber-600/80 transition-all px-6 py-3 ">sign up</a>
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
