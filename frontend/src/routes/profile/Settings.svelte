<script lang="ts">
    import {updateUserProfile, deleteUserProfile} from '$lib/DjangoAPI';
    import {writable} from 'svelte/store';
    import { goto } from '$app/navigation';

    export let notification = writable('');

    export let username;
    export let email;

    let newPassword = '';
    let oldPassword = '';
    let confirmPassword = '';
    
    let validLength = false;
    let validSpecial = false;
    let validUsername = false;
    let validEmail = false;
    let validCase = false;
    let validDuplicate = false;
    let deleteWarning = false;
    
    let allValid = false;

    function toggleWarningDelete() {
        
        deleteWarning = !deleteWarning;
    }

    function handleDelete() {
        
        deleteUserProfile();
        goto('/auth/login');
    }

    function checkPassword(newPassword) {
        
        validLength =(newPassword.length >= 8);
        validCase = newPassword.toUpperCase() != newPassword && newPassword.toLowerCase() != newPassword;
        validSpecial = newPassword.replaceAll(/\w/g, "").length > 0;
    }

    function checkUsername(username) {
        
    validUsername = username.length >= 3;  // Username must be at least 3 characters long
}


    function checkEmail() {
        
        validEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email);
    }

    function checkPasswordsMatch() {
        
    validDuplicate = newPassword === confirmPassword;
}
    

    $: if (oldPassword && newPassword || oldPassword && confirmPassword) {checkPassword(newPassword);
        checkPasswordsMatch();
    } else {
        validLength = true;
        validCase = true;
        validSpecial = true;
        validDuplicate = true;
    };
    $: if (email) {checkEmail()
    } else {
        validEmail = true;  // if email is empty, it's valid
    }
    ;

    $: if (username) {checkUsername(username)
    } else {
        validUsername = true;  // if username is empty, it's valid
    }
    $: allValid = validLength && validCase && validSpecial && validEmail && validDuplicate;

    async function revertChanges () {
        oldPassword = '';
        newPassword = '';
        confirmPassword = '';
        email = '';
        username = '';
        notification.set('Changes reverted');
    }


    async function handleSaveChanges() {
    if (allValid) {
        
        const body = JSON.stringify({ username, email, newPassword, oldPassword });
        try {
            await updateUserProfile(body);
            oldPassword = '';
            newPassword = '';
            confirmPassword = '';
            email = '';
            username = '';
            notification.set('Changes saved successfully');
        } catch (error) {
            console.error('Error saving changes:', error);
            notification.set(error);
        }
    } else {
        notification.set('Invalid input');
        
    }
}


</script>
<div class="flex flex-col">
    <div id="mini-header" class="flex flex-row">
        <h1 class= "text-4xl mb-4 ">settings</h1>
        <button class="ml-4 disabled:text-stone-400/70 hover:text-amber-400/60" disabled={!allValid} on:mousedown = {handleSaveChanges}>apply changes</button>
        <button class="ml-4 disabled:text-stone-400/70 hover:text-amber-400/60" disabled={!allValid} on:mousedown = {revertChanges}>revert changes</button>

    </div>
    
    <div id="grid" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-8 *:bg-white *:p-4 *:w-full *:rounded-lg *:shadow *:dark:bg-stone-800/80">
        <div id="account settings" class="flex flex-col">
            <h2 class="font-bold mb-8">account settings</h2>
            <h3 class="text-sm opacity-60">password</h3>
            <input type="password" bind:value={oldPassword} class='flex bg-stone-50/20 dark:bg-stone-950/20 p-2 w-full shadow-inner focus:ring-amber-700/70 border-none focus:ring-2 rounded-lg' placeholder = "old password" />
            {#if oldPassword}
            <input type="password" bind:value={newPassword} class='flex bg-stone-50/20 dark:bg-stone-950/20 p-2 w-full shadow-inner focus:ring-amber-700/70 border-none focus:ring-2 rounded-lg' placeholder = "new password" />
            
            {#if newPassword}
            <div>
            <span class:valid={validCase} class="normal-case rounded-lg p-1 text-rose-400/80 "> a..Z </span>
            <span class:valid={validLength} class="rounded-lg p-1 text-rose-400/80"> 8+ </span>
            <span class:valid={validSpecial} class="rounded-lg p-1 text-rose-400/80">~&#</span>
        </div>
            {/if}
            
            <input type="password" bind:value={confirmPassword} class='flex bg-stone-50/20 dark:bg-stone-950/20 p-2 w-full shadow-inner focus:ring-amber-700/70 border-none focus:ring-2 rounded-lg' placeholder = "confirm password" />
            {#if confirmPassword}
            <span class:valid={validDuplicate} class="rounded-lg p-1 m-4">match</span>
            {/if}
            {/if}
            <div class="flex flex-row items-center justify-center mt-4">
                <h3 class="text-sm mt-4 flex mr-auto opacity-60">email change</h3>
                {#if email}
                <span class:valid={validEmail} class="ml-auto self-end text-rose-400/80">valid</span>
                {/if}
            </div>
            
            <input type="email" bind:value={email} class='flex bg-stone-50/20 dark:bg-stone-950/20 p-2 w-full shadow-inner focus:ring-amber-700/70 border-none focus:ring-2 rounded-lg' placeholder = "new email" />
            
            <div class="flex flex-row items-center justify-center mt-4">
                <h3 class="text-sm opacity-60 mt-4 mr-auto">username change</h3>
                {#if username}
                <span class:valid={validUsername} class="ml-auto self-end text-rose-400/80">valid</span>
                {/if}
            </div>
            <input type="text" bind:value={username} class='flex bg-stone-50/20 dark:bg-stone-950/20 p-2 w-full shadow-inner focus:ring-amber-700/70 border-none focus:ring-2 rounded-lg' placeholder = "new username" />
            <h3 class="font-normal mt-4">2FA</h3>
            <p class="italic">coming soon</p>
            <div class="group ">
            <h3 class="font-normal mt-4 ">delete account</h3>
            
        {#if deleteWarning}
        <div class="bg-lime-600/10 rounded-lg p-2 flex flex-col items-center *:transition-all">
            <h3 class="font-normal m-4">all i am offering is the truth</h3>
            <button class="bg-sky-400 rounded-md p-2 w-full hover:bg-sky-700 active:scale-95" on:mousedown={handleDelete}>the story ends</button>
            <button class="bg-rose-400 rounded-md p-2 w-full hover:bg-rose-700 active:scale-95" on:mousedown={toggleWarningDelete}>stay in wonderland</button>

        </div>
        {:else}
        <button class="bg-zinc-400 rounded-lg p-2 transition-all invisible group-hover:visible" on:mousedown={toggleWarningDelete}>erase me</button>
        {/if}
        </div>
    </div>
    
<div id = 'prefs-notifs container' class="">
    <h2 class="font-bold mb-8 ">preferences</h2>
    <h3 class="text-sm opacity-60">measurement unit</h3>
    <p class="italic">coming soon</p>
    <label for="imperial">imperial</label>
    <input type="radio" class="focus:ring-0 active:ring-0 hover:ring-0 active:bg-amber-300  checked:bg-amber-400 hover:checked:bg-amber-500 text-amber-400 bg-none border-none ring-amber-50 active:svale-90 transition-all" name="unit" value="imperial" id="imperial">
    <label for="metric">metric</label>
    <input type="radio" class="focus:ring-0 active:ring-0 hover:ring-0 active:bg-amber-300  checked:bg-amber-400 hover:checked:bg-amber-500 text-amber-400 bg-none border-none ring-amber-50 active:svale-90 transition-all" name="unit" value="metric" id="metric" checked>
    <h3 class="mt-4 text-sm opacity-60">default percent</h3>
    <p class="italic">coming soon</p>
    <h3 class="mt-4 text-sm opacity-60">default solvent</h3>
    <p class="italic">coming soon</p>
    <h3 class="mt-4 text-sm opacity-60">language</h3>
    <p>currently supports only English</p>
    </div>  
<div class="">
    <h2 class="mb-2 font-bold">notifications</h2>
<h3 class=" font-normal">email notifications</h3>
<p class="italic">coming soon</p>
<input type='radio' class="focus:ring-0 active:ring-0 hover:ring-0 active:bg-amber-300  checked:bg-amber-400 hover:checked:bg-amber-500 text-amber-400 bg-none border-none ring-amber-50 active:svale-90 transition-all" name='email' value='on' id='email-on' checked>
<label for='email-on'>on</label>
<input type='radio' class="focus:ring-0 active:ring-0 hover:ring-0 active:bg-amber-300  checked:bg-amber-400 hover:checked:bg-amber-500 text-amber-400 bg-none border-none ring-amber-50 active:svale-90 transition-all" name='email' value='off' id='email-off'>
<label for='email-off'>off</label>
</div>


    </div>
    


</div>

<style>
    .valid {
        @apply text-lime-600/60 font-medium;
    }
</style>