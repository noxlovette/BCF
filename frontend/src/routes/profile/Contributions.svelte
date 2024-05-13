 <script lang="ts">
    import { listSuggestedIngredients } from '$lib/DjangoAPI';
    import { onMount } from 'svelte';
    

    let ingredients = null;
    let isLoading = true;
    let error = null;
    
    onMount(async () => {
        try {
            ingredients = await listSuggestedIngredients();
        } catch (e) {
            error = e.message;
        } finally {
            isLoading = false;
        }
    });
    </script>
    <div class="flex flex-col space-y-4">
        <h2 class="text-4xl">Contributions</h2>
        {#if isLoading}
            <p>Loading...</p>
        {:else if error}
            <p>Error: {error}</p>
        {:else}
            <div class="flex flex-col items-start">
                <h3 class="text-2xl font-light border-b-2 border-stone-500">Submitted Ingredients</h3>

                    <ul class="items-start mt-2 space-y-2">
                        {#if ingredients.length > 0}
                            {#each ingredients as ingredient}
                            <li class="flex flex-row">
                                {#if (ingredient.status === "rejected")}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-red-600">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                {:else if (ingredient.status === "approved")} 
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-green-600">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                  </svg>
                                {:else}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-yellow-400">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                  </svg>
                                {/if}
                                {ingredient.common_name}
                            
                            </li>
                            {/each}
                        {:else}
                            <li>There are no ingredients to display.</li>
                        {/if}
                    </ul>
                </div>
        {/if}


    </div>
    
    