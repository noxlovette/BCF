<script lang="ts">
    import { page } from '$app/stores';
</script>

<div class="flex size-full items-center max-w-7xl">
<h1 class="text-6xl">${page.status} {page.error.message}</h1>
<a href="t.me/noxlovette">text me and say what happened</a>
</div>