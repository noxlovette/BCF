<script>
    import { onMount, onDestroy } from 'svelte';
    import { writable } from 'svelte/store';
    import { fetchDataFromDjango } from '$lib/DjangoAPI.js';

    export let text = writable('');

    let dropdownItems = writable([]);
    let active = writable(false);

    let userId

    if (typeof window !== 'undefined') {
        let userId = window.sessionStorage.getItem('user_id');
    }

    let cleanup;

    onMount(() => {
        cleanup = $text.subscribe(async $text => {
            console.log('Populating dropdown...');
            let url = `http://localhost:8000/collection/api/collection/${userId}/?search=${$text}`;
            const data = await fetchDataFromDjango(url);
            if ($text) {
                dropdownItems.set(data.map(item => ({
                    common_name: item.common_name,
                })));
                active.set(true);
            } else {
                dropdownItems.set([]);
                active.set(false);
            }
        });
    });

    onDestroy(() => {
        cleanup();
    });

    function selectItem(item) {
        text.set(item.common_name);
        active.set(false);
    }
</script>

<div>
    <input id="ingredient-input" type="text" bind:value={$text} />
    <ul id="ingredient-dropdown" class="dropdown-menu" class:active={$active}>
        {#each $dropdownItems as item (item.id)}
            <li class="dropdown-item" on:click={() => selectItem(item)}>{item.common_name}</li>
        {/each}
        {#if $dropdownItems.length === 0 && $active}
            <li class="dropdown-item">No matching ingredients found</li>
        {/if}
    </ul>
</div>

<style>
    .dropdown-menu {
        display: none;
    }
    .dropdown-menu.active {
        display: block;
    }
</style>