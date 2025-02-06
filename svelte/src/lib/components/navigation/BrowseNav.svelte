<script lang="ts">
  import { page } from "$app/state";

  let currentPath = $derived(() => page.url.pathname.split("?")[0]);
  let isActive = currentPath.startsWith("/browse");
</script>

<a
  href="/browse"
  class="flex h-20 items-center justify-center rounded-lg text-xl font-bold text-white transition-all
           {isActive
    ? 'bg-ultra-600 scale-105 shadow-lg'
    : 'bg-stone-700 hover:bg-stone-800'}"
>
  Browse
</a>
