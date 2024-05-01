<script>
    import Footer from "$lib/components/Footer.svelte";
    import Header from "$lib/components/Header.svelte";
    import { writable } from "svelte/store";

    let notification = writable("");
    
    </script>
    
    
    <div class="flex flex-col min-h-screen lowercase" style="background: url('/assets/bg/bbblurry-paperwork.svg') no-repeat center center fixed; background-size: cover;">
    <Header currentPage="paperwork" notification = {notification} />
    <div class="flex mb-auto">
        <slot></slot>
    </div>
    <Footer />
    </div>
    