<script lang="ts">
  import { goto } from "$app/navigation";

  function breakStuff() {
    // Navigate to an intentionally broken route
    goto("/this-page-does-not-exist");
  }
</script>

<div class="flex h-screen flex-col items-center justify-center bg-gray-100">
  <h1 class="mb-6 text-4xl font-bold text-gray-800">Let's break things! 💥</h1>
  <button
    class="rounded-lg bg-red-600 p-6 text-2xl font-bold text-white shadow-lg transition duration-300 hover:bg-red-700"
    on:click={breakStuff}
  >
    Hello? (Click me)
  </button>
  <p class="mt-4 text-gray-600">* This will definitely go wrong.</p>
</div>
