<script>
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import { writable } from "svelte/store";
    let notification = writable("");
</script>

<div class="lowercase flex flex-col min-h-screen z-0" style="background: url('/assets/bg/bbblurry-auth.svg') no-repeat center center fixed; background-size: cover;">
    
    <Header currentPage="profile" notification={notification}/>
    <div class="mb-auto flex justify-center items-center">
    <slot></slot>
    </div>
    <Footer/>
</div>

    