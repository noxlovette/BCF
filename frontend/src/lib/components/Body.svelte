<script>

    import Footer from "./Footer.svelte";

</script>
<div class="flex flex-col min-h-screen">

    <div class="mb-auto">
      <slot></slot>
    </div>
    <Footer />
  </div>