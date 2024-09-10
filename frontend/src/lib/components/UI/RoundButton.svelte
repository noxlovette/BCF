<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    function handleClick() {
        dispatch("click");
    }

</script>


<button
on:mousedown={handleClick}
    class="rounded-full border border-gold-400 dark:border-gold-900 bg-gold-700 p-2 text-gold-50 shadow transition-colors hover:bg-white hover:text-gold-700 hover:shadow-lg active:shadow-none dark:hover:bg-stone-800"
  >
<slot />
</button>
