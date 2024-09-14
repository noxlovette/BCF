<script>
	import { goto } from '$app/navigation'; 
	import { Menu } from 'lucide-svelte';
  import { user } from '$lib/stores';
  import { X } from 'lucide-svelte';

	export let isOpen = false;

  let is_authenticated = $user.is_authenticated;

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function navigateAndCloseMenu(path) {
		goto(path); // Navigate to the new page
		isOpen = false; // Close the menu
	}
</script>

<button
	class="fixed inset-0 bg-stone-900 md:hidden bg-opacity-80 backdrop-blur-lg transition-all duration-300 ease-in-out z-40 {isOpen
		? 'opacity-100 pointer-events-auto'
		: 'opacity-0 pointer-events-none'}"
	on:click|self={toggleMenu}
/>

<div class="flex md:hidden">
	<button
		on:click|stopPropagation={toggleMenu}
		class="px-4 py-2 bg-stone-800 text-stone-100 hover:text-stone-800 rounded-lg hover:bg-gold-400 transition-colors duration-300"
	>
		<Menu class="size-8" />
	</button>

	<div
		class="absolute rounded-lg right-0 top-0 bg-stone-900 shadow-lg
    w-full px-8 py-12 space-y-4
    
    transform transition-transform duration-300 ease-in-out {isOpen
			? 'translate-x-0 visible'
			: 'translate-x-full invisible'} z-50"
	>
  <div class="justify-between flex items-center">

    <h1 class="text-4xl">
      BCF
    </h1>
    <button 
    on:click={toggleMenu} 
    >

      <X class="size-8 opacity-65" />
    </button>
  </div>
		<nav class="space-y-8">
			<ul class="space-y-2 flex flex-col">
				<a
					href="/browse"
					on:click|preventDefault={() => navigateAndCloseMenu('/about')}
					class="text-xl bg-stone-700 block p-2 text-stone-100 hover:bg-gold-400 hover:text-stone-800 rounded transition-colors"
					>Browse</a
				>

				<a
					href="/collect"
					on:click|preventDefault={() => navigateAndCloseMenu('/conditions')}
					class="text-xl bg-stone-700 block p-2 text-stone-100 hover:bg-gold-400 hover:text-stone-800 rounded transition-colors"
					>Collect</a
				>

				<a
					href="/formulate"
					on:click|preventDefault={() => navigateAndCloseMenu('/letsgo')}
					class="text-xl bg-stone-700 block p-2 text-stone-100 hover:bg-gold-400 hover:text-stone-800 rounded transition-colors"
					>Formulate</a
				>
			</ul>
      <ul class="space-y-2 flex flex-col">
        {#if is_authenticated}
            <a
              href="https://docs.bcfapp.app"
              title="learn to use BCF"
              class="text-xl bg-stone-700 block p-2 text-stone-100 hover:bg-gold-400 hover:text-stone-800 rounded transition-colors"
            >
              How To
            </a>

            <a
              id="profile"
              href="/profile"
              class="text-xl bg-stone-700 block p-2 text-stone-100 hover:bg-gold-400 hover:text-stone-800 rounded transition-colors"
            >
            Profile
            </a>
          {:else}
            <a href="/auth/login" 
            class="text-xl bg-stone-700 block p-2 text-stone-100 hover:bg-gold-400 hover:text-stone-800 rounded transition-colors"
              >login</a
            >
            <a href="/auth/login" 
            class="text-xl bg-stone-700 block p-2 text-stone-100 hover:bg-gold-400 hover:text-stone-800 rounded transition-colors"
              >sign up</a
            >
            
          {/if}
      </ul>
		</nav>
	</div>
</div>
