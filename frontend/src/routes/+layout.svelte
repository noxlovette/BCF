<script>
    import "../app.css";
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
</script>



<div class="flex flex-col min-h-screen">
    <Header currentPage="layout" />
    <div class="mb-auto">
        <slot></slot>
    </div>
<Footer />
    </div>