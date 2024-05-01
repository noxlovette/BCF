<script>
    import Header from "$lib/components/Header.svelte";
    import { goto } from '$app/navigation';
    import { fetchDataFromDjango } from '$lib/DjangoAPI.ts';
    import { writable } from 'svelte/store';

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

    function check() {
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
    

    $: check(password);
    $: checkEmail(email);
    $: passwordsMatch(password, confirmPassword);
    $: allValid = validLength && validCase && validSpecial && validEmail && validDuplicate && agreeTerms;

    async function createUser() {
        try {
            const url = 'http://localhost:8000/api/signup/';
            let body = {
                username: username,
                email: email,
                password: password,
            };
            const data = await fetchDataFromDjango(url, 'POST', body);

            if (data.error) {
                console.error('Server responded with an error:', data.error);
                notification.set('Login failed...');
            } else {
                sessionStorage.setItem('user_id', data.user_id);
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
    <div id = "authentification" class="flex items-center justify-center m-10 p-2">
        <form on:submit|preventDefault={createUser} class= "flex-col w-1/2 space-y-2">
            <div class="">
                <label class="flex items-center">
                    Username:
                    <input type="text" class='flex flex-1 p-2 ml-4 mr-4 bg-white/20' required bind:value={username}/>
                </label>
            </div>
            <div class="">
                <label class="flex items-center">
                    Email:
                    <input type="email" class='flex flex-1 p-2 ml-4 mr-4 bg-white/20' bind:value={email}/>
                    <span class:valid={validEmail} class = "ml-auto">valid</span>
                </label>
                
            </div>
            <div class="">
                <label class="flex items-center">
                    Password:
                    <input type="password" class='flex flex-1 p-2 ml-4 mr-4 bg-white/20' bind:value={password}/>
                    <div class="flex flex-row ml-auto space-x-4">
                    <span class:valid={validLength}> 8+ </span>
                    <span class:valid={validCase} class="normal-case"> a..Z </span>
                    <span class:valid={validSpecial}>~&#</span>
                    </div>
                </label>
            </div>
            <div class = "">
                <label class="flex items-center">
                    repeat password:
                    <input type="password" class='flex flex-1 p-2 mx-4 bg-white/20' bind:value={confirmPassword}/>
                    <span class:valid={validDuplicate} class="ml-auto">match</span>
                </label>
                

            </div>
            <div class="">
            <label class="flex items-center">
                <a href="/paperwork/terms-of-service" class="dark:hover:text-amber-300/90 hover:text-amber-900/90">I agree to the terms of use </a>
                <input type="checkbox" bind:checked={agreeTerms} class="flex mx-4" />
              </label>
            
            <button type="submit" class="pt-6 disabled:text-stone-400/70" disabled={!allValid}>create account</button>
            </div>
        </form>
        
    </div>

</main>

<style>
    .valid {
        @apply bg-lime-600/50;
    }
</style>