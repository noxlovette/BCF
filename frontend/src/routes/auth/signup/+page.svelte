<script>
    import Header from "$lib/components/Header.svelte";
    import { goto } from '$app/navigation';
    import { fetchCentralDjangoApi } from '$lib/DjangoAPI.ts';
    import { writable } from 'svelte/store';
    import { fade } from "svelte/transition";
    import { scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";

    let notification = writable();
    let username = '';
    let email = '';
    let password = '';
    let validLength = false;
    let validSpecial = false;
    let validEmail = false;
    let validCase = false;
    let validDuplicate = false;
    let agreeTerms = false;
    let allValid = false;
    let confirmPassword = '';

    function checkPassword() {
        validLength =(password.length >= 8);
        validCase = password.toUpperCase() != password && password.toLowerCase() != password;
        validSpecial = password.replaceAll(/\w/g, "").length > 0;
    }


    function checkEmail() {
        validEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email);
    }

    function passwordsMatch(password, confirmPassword) {
        validDuplicate = password === confirmPassword;
    }
    

    $: checkPassword(password);
    $: checkEmail(email);
    $: passwordsMatch(password, confirmPassword);
    $: allValid = validLength && validCase && validSpecial && validEmail && validDuplicate && agreeTerms;

    // TODO TRANSFER TO CENTRAL API
    async function createUser() {
        try {
            const url = 'http://localhost:8000/api/signup/';
            let body = {
                username: username,
                email: email,
                password: password,
            };
            const data = await fetchCentralDjangoApi(url, 'POST', body);

            if (data.error) {
                console.error('Server responded with an error:', data.error);
                notification.set('Login failed...');
            } else {
                sessionStorage.setItem('username', data.username);
                sessionStorage.setItem('is_authenticated', data.is_authenticated);
                notification.set('Signup successful!');

                goto('/collect/');
            
            } 
        } catch (error) {
                console.error('Failed to fetch:', error);
        }
    };
</script>

<Header currentPage="signup" notification={notification}/>

<main class = "lowercase">
    <div id = "authentification" class="flex flex-col items-center justify-center m-10">
        <h1 class="flex font-light text-6xl tracking-tighter"
        in:scale={{
            duration: 500,
            opacity: 0.5,
            delay: 0,
            easing: quintOut
        }}>welcome</h1>
        
        <form on:submit|preventDefault={createUser} class= "flex flex-col justify-center items-center w-1/3 bg-stone-50/20 dark:bg-stone-950/20 rounded-lg shadow p-4"
        in:fade={{
            duration: 500,
            delay: 500,
            easing: quintOut
        }}
        >
            <div class="flex flex-col items-center justify-between">
                <input type="text" class='flex  bg-stone-50/20 dark:bg-stone-950/20 p-2 w-full m-4 shadow focus:ring-amber-700/70 border-none focus:ring-2 rounded-lg' placeholder="username" required bind:value={username}/>

            </div>
            <div id  = 'handle email' class="flex flex-col items-center justify-between">
                    <input type="email" class=' bg-stone-50/20 dark:bg-stone-950/20 p-2 w-full m-4 shadow focus:ring-amber-700/70 border-none focus:ring-2 rounded-lg' placeholder="email" bind:value={email}/>
                    <span class:valid={validEmail} class="rounded-lg p-1">valid</span>
            </div>
            <div id = 'handle pass' class="flex flex-col items-center justify-between">
                    <input type="password" class='flex bg-stone-50/20 dark:bg-stone-950/20 p-2 w-full m-4 shadow focus:ring-amber-700/70 border-none focus:ring-2 rounded-lg' placeholder="password" bind:value={password}/>
                    <div class="flex flex-row justify-center space-x-4">
                    <span class:valid={validCase} class="normal-case rounded-lg p-1"> a..Z </span>
                    <span class:valid={validLength} class="rounded-lg p-1"> 8+ </span>
                    <span class:valid={validSpecial} class="rounded-lg p-1">~&#</span>
                    </div>
            </div>
            <div class="flex flex-col items-center justify-between" id = 'handle 2nd pass'>
                    <input type="password" class='flex  bg-stone-50/20 dark:bg-stone-950/20 p-2 w-full m-4 shadow focus:ring-amber-700/70 border-none focus:ring-2 rounded-lg' placeholder="password... again" bind:value={confirmPassword}/>
                    <span class:valid={validDuplicate} class="rounded-lg p-1">match</span>
            </div>
            <div id = 'paperwork' class="flex flex-row items-center justify-between *:m-2 m-4">
                <a href="/paperwork/terms-of-service" class="dark:hover:text-amber-300/90 hover:text-amber-900/90 ">I agree to the terms of use </a>
                <input type="checkbox" bind:checked={agreeTerms} class="size-4 rounded-full shadow border-none text-amber-700/90 focus:ring-amber-700/30 checked:bg-amber-700/70 active:scale-90 checked:ring-amber-700/30 hover:checked:bg-amber-700/80 transition-all hover:scale-110" />            
            </div>
            <button type="submit" class="p-6 disabled:text-stone-400/70 hover:text-amber-400/60" disabled={!allValid}>create account</button>
        </form>
        
    </div>

</main>

<style>
    .valid {
        @apply bg-lime-600/50;
    }
</style>