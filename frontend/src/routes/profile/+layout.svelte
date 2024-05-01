<script>
    import Header from "$lib/components/Header.svelte";
    import { writable } from "svelte/store";
    import { onMount } from "svelte";

    let userId = "";
    let username = "";

    onMount(() => {
        userId = sessionStorage.getItem('user_id');
        username = sessionStorage.getItem("username") || "";

        if (!userId) {
        window.location.href = '/auth/login';
        notification.set("Please log in to view your profile")
    }

    notification.set("Welcome to your profile page " + username + "!");
    });

    // If the user is not logged in, redirect to the login page

    let notification = writable("");
</script>

<Header currentPage="profile" notification={notification}/>
<main>
    <div class="flex justify-center">
        <div class="w-full md:w-1/2">
            <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h1>Welcome, {username}!</h1>
                <slot></slot>
            </div>
        </div>
</main>
