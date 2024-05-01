<script>
import Footer from "$lib/components/Footer.svelte";
import { writable } from "svelte/store";

let notification = writable("");

</script>


<div class="flex flex-col min-h-screen transition-opacity" style="background: url('/assets/bg/bbblurry-auth.svg') no-repeat center center fixed; background-size: cover;">
<div class="mb-auto">

    <slot></slot>


</div>
<Footer />
</div>
