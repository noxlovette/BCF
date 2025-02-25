<script lang="ts">
  import { fade } from "svelte/transition";

  let {
    header = "Card",
    body = "Very Gute Karte!",
    href = ".",
    style = "",
    descriptors = [],
  } = $props();
</script>

<a
  id="card-small"
  {href}
  class="group hover:ring-saffron-400 flex flex-col justify-between
bg-stone-50 p-3 shadow-sm
         ring-2 ring-stone-200 transition-all hover:shadow-md
         md:rounded-lg dark:bg-stone-900 dark:ring-stone-900"
  tabindex="0"
  {style}
  transition:fade
>
  <h2
    class="text-saffron-800 mb-2 truncate text-xl
           font-semibold tracking-tight"
    title={header}
  >
    {header}
  </h2>

  <p class="line-clamp-2 text-sm opacity-80">
    {body}
  </p>

  <!-- Descriptors section -->
  {#if descriptors.length}
    <div class="mt-2 flex flex-wrap gap-1">
      {#each descriptors as descriptor}
        <span
          class="rounded-md bg-stone-100 px-3 py-1 text-xs text-stone-700 shadow-sm dark:bg-stone-700 dark:text-stone-100"
        >
          {descriptor}
        </span>
      {/each}
    </div>
  {/if}
</a>

<style>
  .truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
