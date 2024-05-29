<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import { goto } from '$app/navigation';
    import { signUp } from '$lib/DjangoAPI';
    import { writable } from 'svelte/store';
    import { fade } from "svelte/transition";
    import { scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";
import { onMount } from 'svelte';
  

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

    function checkPassword(password) {

        validLength =(password.length >= 8);
        validCase = password.toUpperCase() != password && password.toLowerCase() != password;
        validSpecial = password.replaceAll(/\w/g, "").length > 0;
    }


    function checkEmail(email) {
        validEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email);

    }

    function passwordsMatch(password, confirmPassword) {
        validDuplicate = password === confirmPassword;
    }

    $: checkPassword(password);
    $: checkEmail(email);
    $: passwordsMatch(password, confirmPassword);
    $: allValid = validLength && validCase && validSpecial && validEmail && validDuplicate && agreeTerms && !!username;

    onMount(() => {
    // Check localStorage only once when the component is mounted
    agreeTerms = sessionStorage.getItem('terms') === 'true';
  });

    async function handleSignup() {
        try {
            let body = {
                username: username,
                email: email,
                password: password,
            };
            const data = await signUp(body);
            if (data.error) {
                console.error('Server responded with an error:', data.error);
                notification.set(data.error);
            } else {
                sessionStorage.setItem('username', data.username);
                sessionStorage.setItem('is_authenticated', data.is_authenticated);
                notification.set('Signup successful!');
                goto('/collect/');
            } 
        } catch (error) {
                console.error('Failed to fetch:', error);
                notification.set('something went wrong');
        }
    };

</script>
<svelte:head>
  <title>BCF | Signup</title>
</svelte:head>

<Header currentPage="signup" />

<main class = "">
    <div class="mx-auto max-w-[800px] xl:max-w-7xl">
    <div id = "authentification" class="flex flex-col items-center justify-center m-10">
        <form on:submit|preventDefault={handleSignup} class= "flex flex-col w-[380px] h-[600px] justify-start items-start bg-white dark:bg-stone-950 rounded-lg shadow p-8"
        in:fade={{
            duration: 100,
            easing: quintOut
        }}
        >
        <h1 class="text-6xl font-bold tracking-tighter border-b-2">sign up<span class="text-amber-300">.</span></h1>

                <input type="text" class='w-full my-2 mt-8 bg-stone-50 dark:bg-stone-800 shadow-inner focus:ring-amber-300 border-none focus:ring-2 rounded-lg' placeholder="username" required bind:value={username}/>

            <div id  = 'handle email' class="flex justify-center items-center mb-4">
                    <input type="email" class='w-[225] my-2 mr-auto bg-stone-50 dark:bg-stone-800 shadow-inner focus:ring-amber-300 border-none focus:ring-2 rounded-lg' placeholder="email" bind:value={email}/>
                    <span class:valid={validEmail} class="text-left rounded-lg ml-4 p-2 h-[40px] w-[96px] text-stone-900/60 dark:text-stone-50/60 shadow-inner bg-stone-50 dark:bg-stone-800">valid</span>
            </div>
            <div id = 'handle pass' class="w-full flex justify-center items-center">
                    <input type="password" class='w-[225] my-2 mr-auto bg-stone-50 dark:bg-stone-800 shadow-inner focus:ring-amber-300 border-none focus:ring-2 rounded-lg' placeholder="password" bind:value={password}/>
                    <span class:valid={validCase} class="normal-case mx-4 text-stone-900/60 dark:text-stone-50/60 rounded-lg p-2 size-[40px] shadow-inner bg-stone-50 dark:bg-stone-800"> aZ </span>
                    <span class:valid={validLength} class="text-baseline text-stone-900/60 dark:text-stone-50/60 rounded-lg p-2 size-[40px] shadow-inner bg-stone-50 dark:bg-stone-800"> 8+ </span>
            </div>
            <div class="flex justify-center items-center" id = 'handle 2nd pass'>
                    <input type="password" class='w-[225] my-2 mr-auto bg-stone-50 dark:bg-stone-800 shadow-inner focus:ring-amber-300 border-none focus:ring-2 rounded-lg' placeholder="repeat" bind:value={confirmPassword}/>
                    <span class:valid={validDuplicate} class="text-center  text-stone-900/60 dark:text-stone-50/60 rounded-lg mx-4 p-2 size-[40px] shadow-inner bg-stone-50 dark:bg-stone-800 rotate-90">||</span>
                    <span class:valid={validSpecial} class="text-center text-stone-900/60 dark:text-stone-50/60 rounded-lg p-2 size-[40px] shadow-inner bg-stone-50 dark:bg-stone-800">&~</span>
            </div>
            <div id = 'paperwork' class="flex flex-row items-center justify-between space-x-4 my-4">
                <a href="/paperwork/terms-of-service" 
                
                on:mousedown={() => sessionStorage.setItem('terms', 'true')}
                
                class="hover:text-amber-300 text-stone-900/80 dark:text-stone-50/80">agree to the terms</a>
                <input type="checkbox" bind:checked={agreeTerms} class="size-4 bg-stone-50 dark:bg-stone-800 ring-2 ring-stone-300/50 rounded-lg shadow-inline border-none text-lime-500 focus:ring-lime-700 checked:bg-lime-500 active:scale-90 checked:ring-amber-300 hover:checked:bg-amber-300 transition-all hover:scale-110" />            
            </div>
            <button type="submit" class="text-5xl font-bold tracking-tighter active:scale-90 disabled:text-stone-400/70 hover:text-amber-300" disabled={!allValid}>go</button>
            <a href="/auth/login" class= "flex text-sm mt-auto opacity-60 hover:text-amber-300 hover:opacity-100 transition-all">have an account? sign in</a>
        </form>
    </div>
    </div>

</main>

<style>
    .valid {
        @apply text-lime-50;
        @apply bg-lime-500;
    }
</style>