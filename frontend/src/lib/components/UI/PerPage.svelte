<script lang="ts">
    import { pageSize } from "$lib/stores";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    function updatePageSize () {
        dispatch("updatePageSize");
    }
    

</script>

<label
      class="md:text-md group mr-auto hidden opacity-60 transition-opacity hover:opacity-100 sm:text-sm lg:block"
    >
      per page:
      <input
        type="number"
        class="w-1/3 rounded-lg border-none focus:ring-2 focus:ring-gold-400/70 group-hover:shadow dark:bg-stone-800"
        min="1"
        bind:value={$pageSize}
        on:change={updatePageSize}
      />
    </label>