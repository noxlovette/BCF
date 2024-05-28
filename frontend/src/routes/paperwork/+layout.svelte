<script>
    import Footer from "$lib/components/Footer.svelte";
    import Header from "$lib/components/Header.svelte";
    import { writable } from "svelte/store";

    let notification = writable("");
    
    </script>
    
    <svelte:head>
  <title>BCF | Paperwork</title>
</svelte:head>
    <div class="flex flex-col min-h-screen" >
    <Header currentPage="paperwork" notification = {notification} />
    <div class="mb-auto">
        <slot></slot>
    </div>
    <Footer />
    </div>
    