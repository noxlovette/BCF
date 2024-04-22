<script>

  import { onMount } from 'svelte';
  import { scale } from 'svelte/transition';
  import {quintOut} from "svelte/easing";
  import { fade } from 'svelte/transition';

  let isMounted = false;

    onMount(() => {
        console.log('mounted');
        isMounted = true;
    });


</script>

<main>
  <div id="hero" class="flex flex-auto items-center justify-center m-10 p-2">
    <div class="text-center">
      {#if isMounted}
        <h1 class="text-9xl font-thin tracking-widest"
            transition:scale={{ duration: 500, delay: 0, opacity: 0.5, start: 0.5, easing: quintOut }}
        >PERFUMERY</h1>
      <h2 class="text-3xl font-thin tracking-normal mt-2"
        transition:fade={{duration: 500, delay: 100, opacity: 0.5, easing: quintOut}}
        >Nothing else.</h2>
        <div id="buttons" class="mt-6 flex justify-center"
             transition:fade={{duration: 500, delay: 600, opacity: 0.5, easing: quintOut}}
        >
          <a href="/browse" class="button" role="button"
          transition:fade={{duration: 500, delay: 300, opacity: 0.5, easing: quintOut}}
          >Browse</a>
          <a href="/collect" class="button" role="button">Collect</a>
          <a href="/formulate" class="button" role="button">Formulate</a>
        </div>
        <p class="mt-6 font-regular tracking-wide text-gray-800"
           transition:fade={{duration: 500, delay: 300, opacity: 0.5, easing: quintOut}}
        >Browse our database. Add ingredients to your collection. Formulate a revolution.</p>

      {/if}
    </div>
  </div>
</main>


<style>
  .button {
    @apply py-2 px-4 bg-amber-700 text-white rounded-md mr-4 ;
    transition: background-color 0.5s ease, transform 0.5s ease, box-shadow 0.5s ease;
  }

  .button:hover {
    @apply bg-amber-600 shadow;
    transform: scale(1.2);
  }
</style>