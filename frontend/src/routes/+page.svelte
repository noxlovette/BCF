<script>
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
  "How does a penguin build its house? Igloos it together."
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

function stopNotificationInterval() {
  clearInterval(notificationInterval);
} // Start the interval when the page loads

  onMount(() => {
    console.log("mounted");
    isMounted = true;
    setTimeout(startNotificationInterval, 20000);
  });




</script>
<div class="flex flex-col min-h-screen mb-auto transition-opacity" style="background: url('/assets/bg/bbblurry-main.svg') no-repeat center center fixed; background-size: cover;">

    <Header currentPage="home" notification = {notification} />

  <div id="hero" class="flex flex-auto items-center m-10 p-2">
    <div class="flex space-x-4 ml-10 mb-40 text-left">
      {#if isMounted}

        <h1
          class="text-9xl font-thin tracking-widest"
          transition:scale={{
            duration: 500,
            delay: 0,
            opacity: 0.5,
            start: 0.5,
            easing: quintOut,
          }}
        >
          PERFUMERY
        </h1>

        <div id = "right side" class="flex flex-col">
          <h2
          class="text-3xl font-thin tracking-normal mt-2 text-stone-600/60 dark:text-stone-100/60"
          transition:fade={{
            duration: 500,
            delay: 100,

            easing: quintOut,
          }}
        >nothing else.
        </h2>

        <div
        id="buttons"
        class="mt-auto flex flex-row items-center justify-center *:m-2 *:p-2 *:ml-0 *:pl-0 font-light"
        transition:fade={{duration: 500, delay: 600, easing: quintOut,}}>
        <a href="/browse"class="button hover:text-sky-300/80">browse</a>
        <a href="/collect" class="button hover:text-pink-400/80">collect</a>
        <a href="/formulate" class="button hover:text-lime-300/80">formulate</a>
      </div>
        </div>

        
      {/if}
    </div>
  </div>
  <Footer />
  </div>
  




<style>

</style>
