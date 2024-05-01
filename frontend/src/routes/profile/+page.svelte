<script>
    import { onMount } from "svelte";
    import { fetchDataFromDjango } from "$lib/DjangoAPI.ts";
    import { writable } from "svelte/store";

    let username = "";
    let userId = "";
    let ingredients = [];
    let notification = writable("");
    let isLoading = true;

    onMount(async () => {
    userId = sessionStorage.getItem('user_id');
    username = sessionStorage.getItem('username');

    if (!userId) {
        window.location.href = '/auth/login';
        notification.set("Please log in to view your profile")
    }

    notification.set("Welcome to your profile page " + username + "!");

    ingredients = await listSuggestedIngredients();
    isLoading = false;
});


    function listSuggestedIngredients() {
        const url = `http://localhost:8000/browse/api/suggested-ingredients/${userId}/`;
        try {
            const data = fetchDataFromDjango(url, "GET");
            console.log("Response:", ingredients);
            notification.set("Ingredients loaded successfully");
            return data
        } catch (error) {
            console.error("Failed to load ingredients");
            notification.set("Failed to load ingredients");
        }
    }

    
</script>
<div class="bg-white shadow-md rounded p-2 m-2 flex items-center text-center">
    <h1 class="text-2xl">Welcome, {username}!</h1>
    </div>

<div class="bg-white shadow-md rounded p-2 m-2 flex items-center text-center">
    <h1>submitted ingredients</h1>
    <p>Here are the ingredients you have submitted:</p>
    <div>
        <ul>
            {#each ingredients as ingredient}
            <li>{ingredient.common_name}</li>
            {/each}
        </ul>
    </div>


</div>


<style></style>