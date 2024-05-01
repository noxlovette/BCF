<script>
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import { writable } from "svelte/store";
    import { onMount } from "svelte";

    let userId = "";
    let username = "";

    onMount(() => {
        userId = sessionStorage.getItem('user_id');

        if (!userId) {
        window.location.href = '/auth/login';
        notification.set("Please log in to view your profile")
    }

    });

    // If the user is not logged in, redirect to the login page

    let notification = writable("");
</script>

<div class="lowercase flex flex-col min-h-screen z-0" style="background: url('/assets/bg/bbblurry-auth.svg') no-repeat center center fixed; background-size: cover;">
    <div class="mb-auto">
    <Header currentPage="profile" notification={notification}/>
    <slot></slot>
    </div>
    <Footer/>
</div>

    