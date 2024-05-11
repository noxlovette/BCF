<script>

    let username = '';
    let email = '';
    let newPassword = '';
    let oldPassword = '';
    let validLength = false;
    let validSpecial = false;
    let validEmail = false;
    let validCase = false;
    let validDuplicate = false;
    let allValid = false;
    let confirmPassword = '';

    function check() {
        validLength =(newPassword.length >= 8);
        validCase = newPassword.toUpperCase() != newPassword && newPassword.toLowerCase() != newPassword;
        validSpecial = newPassword.replaceAll(/\w/g, "").length > 0;
    }


    function checkEmail() {
        validEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email);
    }

    function passwordsMatch(newPassword, confirmPassword) {
        validDuplicate = newPassword === confirmPassword;
    }
    

    $: if (newPassword) {check(newPassword)};
    $: if (email) {checkEmail(email)};
    $: passwordsMatch(newPassword, confirmPassword);
    $: allValid = validLength && validCase && validSpecial && validEmail && validDuplicate;

    async function saveChanges () {
        if (allValid) {
            console.log('saving changes');
        } else {
            console.log('invalid input');
        }
        
    }

    async function revertChanges () {
        if (allValid) {
            console.log('reverting changes');
        } else {
            console.log('invalid revert');
        }
        
    }
</script>
<div class="flex flex-col">
    <div id="mini-header" class="flex flex-row">
        <h1 class= "text-4xl mb-4 ">settings</h1>
        <button class="ml-4 disabled:text-stone-400/70 hover:text-amber-400/60" disabled={allValid} on:click = {saveChanges}>apply changes</button>
        <button class="ml-4 disabled:text-stone-400/70 hover:text-amber-400/60" disabled={allValid} on:click = {revertChanges}>revert changes</button>

    </div>
    
    <div id="grid" class="grid grid-cols-3 space-x-8">
        <div id="account settings" class="bg-stone-100/20 rounded-lg shadow p-2">
            <h2 class="font-bold mb-2">account settings</h2>
            <h3 class="font-normal">password</h3>
            <input type="password" bind:value={oldPassword} class='flex bg-stone-50/20 dark:bg-stone-950/20 p-2 w-full shadow focus:ring-amber-700/70 border-none focus:ring-2 rounded-lg' placeholder = "old password" />
            {#if oldPassword}
            <input type="password" bind:value={newPassword} class='flex bg-stone-50/20 dark:bg-stone-950/20 p-2 w-full shadow focus:ring-amber-700/70 border-none focus:ring-2 rounded-lg' placeholder = "new password" />
            
            {#if newPassword}
            <div>
            <span class:valid={validCase} class="normal-case rounded-lg p-1"> a..Z </span>
            <span class:valid={validLength} class="rounded-lg p-1"> 8+ </span>
            <span class:valid={validSpecial} class="rounded-lg p-1">~&#</span>
        </div>
            {/if}
            
            
            
            <input type="password" bind:value={confirmPassword} class='flex bg-stone-50/20 dark:bg-stone-950/20 p-2 w-full shadow focus:ring-amber-700/70 border-none focus:ring-2 rounded-lg' placeholder = "confirm password" />
            {#if confirmPassword}
            <span class:valid={validDuplicate} class="rounded-lg p-1">match</span>
            {/if}
            {/if}
            <h3 class="font-normal mt-4">email change</h3>
            <input type="email" bind:value={email} class='flex bg-stone-50/20 dark:bg-stone-950/20 p-2 w-full shadow focus:ring-amber-700/70 border-none focus:ring-2 rounded-lg' placeholder = "new email" />
            {#if email}
            <span class:valid={validEmail} class="rounded-lg p-1">valid</span>
            {/if}
            <h3 class="font-normal mt-4">username change</h3>
            <input type="text" bind:value={username} class='flex bg-stone-50/20 dark:bg-stone-950/20 p-2 w-full shadow focus:ring-amber-700/70 border-none focus:ring-2 rounded-lg' placeholder = "new username" />
            <h3 class="font-normal mt-4">2FA</h3>
            <p class="font-thin">coming soon</p>
            <h3 class="font-normal mt-4">delete account</h3>
            <button class="bg-red-400 rounded-lg p-2">erase me</button>
        </div>
    
<div id = 'prefs-notifs container' class="bg-stone-100/20 rounded-lg shadow p-2">
    <h2 class="font-bold mb-2 ">preferences</h2>
    <h3 class="font-normal">measurement unit</h3>
    <label for="imperial">imperial</label>
    <input type="radio" name="unit" value="imperial" id="imperial">
    <label for="metric">metric</label>
    <input type="radio" name="unit" value="metric" id="metric" checked>
    <h3 class="mt-4 font-normal">default percent</h3>
    <input type="number" min="0" max="100" value="10">
    <h3 class="mt-4 font-normal">default volume</h3>
    <h3 class="mt-4 font-normal">language</h3>
    <p>currently supports only English</p>
    </div>  
    <div class="bg-stone-100/20 rounded-lg shadow p-2">
        <h2 class="mb-2 font-bold">notifications</h2>
    <h3 class=" font-normal">email notifications</h3>
    <input type='radio' name='email' value='on' id='email-on' checked>
    <label for='email-on'>on</label>
    <input type='radio' name='email' value='off' id='email-off'>
    <label for='email-off'>off</label>
    </div>


    </div>
    


</div>
