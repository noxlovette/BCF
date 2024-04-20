<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { fetchDataFromDjango } from '$lib/DjangoAPI.js';

    let username = '';
    let password = '';

    const handleSubmit = async () => {
        try {
            let url = 'http://localhost:8000/api/login/';
            let body = {
                username: username,
                password: password,
            };
            const data = await fetchDataFromDjango(url, 'POST', body)

            if (data.error) {
                console.error('Server responded with an error:', data.error);
            } else {
                sessionStorage.setItem('user_id', data.user_id);
                sessionStorage.setItem('username', data.username);
                sessionStorage.setItem('is_authenticated', data.is_authenticated);

                goto('/collect/');
            }
        } catch (error) {
            console.error('Failed to fetch:', error);
        }
    };
</script>

<main>
    <form on:submit|preventDefault={handleSubmit}>
        <label for="username-field">Username:</label>
        <input id="username-field" type="text" bind:value={username} required>

        <label for="password-field">Password:</label>
        <input id="password-field" type="password" bind:value={password} required>

        <button type="submit">Login</button>
    </form>
</main>

<style>
    /* Your CSS styles here */
</style>