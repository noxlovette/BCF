<script lang="ts">
  import { updateUserProfile, deleteUserProfile } from "$lib/DjangoAPI";

  import { goto } from "$app/navigation";
  import { notification } from "$lib/stores/notificationStore";

  export let username;
  export let email;

  let newPassword = "";
  let oldPassword = "";
  let confirmPassword = "";

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
    goto("/auth/login");
  }

  function checkPassword(newPassword) {
    validLength = newPassword.length >= 8;
    validCase =
      newPassword.toUpperCase() != newPassword &&
      newPassword.toLowerCase() != newPassword;
    validSpecial = newPassword.replaceAll(/\w/g, "").length > 0;
  }

  function checkUsername(username) {
    validUsername = username.length >= 3; // Username must be at least 3 characters long
  }

  function checkEmail() {
    validEmail =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
        email,
      );
  }

  function checkPasswordsMatch() {
    validDuplicate = newPassword === confirmPassword;
  }

  $: if ((oldPassword && newPassword) || (oldPassword && confirmPassword)) {
    checkPassword(newPassword);
    checkPasswordsMatch();
  } else {
    validLength = true;
    validCase = true;
    validSpecial = true;
    validDuplicate = true;
  }
  $: if (email) {
    checkEmail();
  } else {
    validEmail = true; // if email is empty, it's valid
  }
  $: if (username) {
    checkUsername(username);
  } else {
    validUsername = true; // if username is empty, it's valid
  }
  $: allValid =
    validLength && validCase && validSpecial && validEmail && validDuplicate;

  async function revertChanges() {
    oldPassword = "";
    newPassword = "";
    confirmPassword = "";
    email = "";
    username = "";
    notification.set({ message: "Changes reverted", type: "info" });
  }

  async function handleSaveChanges() {
    if (allValid) {
      const body = JSON.stringify({
        username,
        email,
        newPassword,
        oldPassword,
      });
      try {
        await updateUserProfile(body);
        oldPassword = "";
        newPassword = "";
        confirmPassword = "";
        email = "";
        username = "";
        notification.set({
          message: "Changes saved successfully",
          type: "success",
        });
      } catch (error) {
        notification.set({ message: error, type: "error" });
      }
    } else {
      notification.set({ message: "Invalid input", type: "error" });
    }
  }
</script>

<div class="flex flex-col">
  <div id="mini-header" class="flex flex-row">
    <h1 class="mb-4 text-4xl">settings</h1>
    <button
      class="ml-4 hover:text-amber-400/60 disabled:text-stone-400/70"
      disabled={!allValid}
      on:mousedown={handleSaveChanges}>apply changes</button
    >
    <button
      class="ml-4 hover:text-amber-400/60 disabled:text-stone-400/70"
      disabled={!allValid}
      on:mousedown={revertChanges}>revert changes</button
    >
  </div>

  <div
    id="grid"
    class="grid grid-cols-1 gap-4 *:w-full *:rounded-lg *:bg-white *:p-4 *:shadow lg:grid-cols-2 xl:grid-cols-3 xl:gap-8 *:dark:bg-stone-800/80"
  >
    <div id="account settings" class="flex flex-col">
      <h2 class="mb-8 font-bold">account settings</h2>
      <h3 class="text-sm opacity-60">password</h3>
      <input
        type="password"
        bind:value={oldPassword}
        class="flex w-full rounded-lg border-none bg-stone-50/20 p-2 shadow-inner focus:ring-2 focus:ring-amber-700/70 dark:bg-stone-950/20"
        placeholder="old password"
      />
      {#if oldPassword}
        <input
          type="password"
          bind:value={newPassword}
          class="flex w-full rounded-lg border-none bg-stone-50/20 p-2 shadow-inner focus:ring-2 focus:ring-amber-700/70 dark:bg-stone-950/20"
          placeholder="new password"
        />

        {#if newPassword}
          <div>
            <span
              class:valid={validCase}
              class="rounded-lg p-1 normal-case text-rose-400/80"
            >
              a..Z
            </span>
            <span
              class:valid={validLength}
              class="rounded-lg p-1 text-rose-400/80"
            >
              8+
            </span>
            <span
              class:valid={validSpecial}
              class="rounded-lg p-1 text-rose-400/80">~&#</span
            >
          </div>
        {/if}

        <input
          type="password"
          bind:value={confirmPassword}
          class="flex w-full rounded-lg border-none bg-stone-50/20 p-2 shadow-inner focus:ring-2 focus:ring-amber-700/70 dark:bg-stone-950/20"
          placeholder="confirm password"
        />
        {#if confirmPassword}
          <span class:valid={validDuplicate} class="m-4 rounded-lg p-1"
            >match</span
          >
        {/if}
      {/if}
      <div class="mt-4 flex flex-row items-center justify-center">
        <h3 class="mr-auto mt-4 flex text-sm opacity-60">email change</h3>
        {#if email}
          <span
            class:valid={validEmail}
            class="ml-auto self-end text-rose-400/80">valid</span
          >
        {/if}
      </div>

      <input
        type="email"
        bind:value={email}
        class="flex w-full rounded-lg border-none bg-stone-50/20 p-2 shadow-inner focus:ring-2 focus:ring-amber-700/70 dark:bg-stone-950/20"
        placeholder="new email"
      />

      <div class="mt-4 flex flex-row items-center justify-center">
        <h3 class="mr-auto mt-4 text-sm opacity-60">username change</h3>
        {#if username}
          <span
            class:valid={validUsername}
            class="ml-auto self-end text-rose-400/80">valid</span
          >
        {/if}
      </div>
      <input
        type="text"
        bind:value={username}
        class="flex w-full rounded-lg border-none bg-stone-50/20 p-2 shadow-inner focus:ring-2 focus:ring-amber-700/70 dark:bg-stone-950/20"
        placeholder="new username"
      />
      <h3 class="mt-4 font-normal">2FA</h3>
      <p class="italic">coming soon</p>
      <div class="group">
        <h3 class="mt-4 font-normal">delete account</h3>

        {#if deleteWarning}
          <div
            class="flex flex-col items-center rounded-lg bg-lime-600/10 p-2 *:transition-all"
          >
            <h3 class="m-4 font-normal">all i am offering is the truth</h3>
            <button
              class="w-full rounded-md bg-sky-400 p-2 hover:bg-sky-700 active:scale-95"
              on:mousedown={handleDelete}>the story ends</button
            >
            <button
              class="w-full rounded-md bg-rose-400 p-2 hover:bg-rose-700 active:scale-95"
              on:mousedown={toggleWarningDelete}>stay in wonderland</button
            >
          </div>
        {:else}
          <button
            class="invisible rounded-lg bg-zinc-400 p-2 transition-all group-hover:visible"
            on:mousedown={toggleWarningDelete}>erase me</button
          >
        {/if}
      </div>
    </div>

    <div id="prefs-notifs container" class="">
      <h2 class="mb-8 font-bold">preferences</h2>
      <h3 class="text-sm opacity-60">measurement unit</h3>
      <p class="italic">coming soon</p>
      <label for="imperial">imperial</label>
      <input
        type="radio"
        class="active:svale-90 border-none bg-none text-amber-400 ring-amber-50 transition-all checked:bg-amber-400 hover:ring-0 hover:checked:bg-amber-500 focus:ring-0 active:bg-amber-300 active:ring-0"
        name="unit"
        value="imperial"
        id="imperial"
      />
      <label for="metric">metric</label>
      <input
        type="radio"
        class="active:svale-90 border-none bg-none text-amber-400 ring-amber-50 transition-all checked:bg-amber-400 hover:ring-0 hover:checked:bg-amber-500 focus:ring-0 active:bg-amber-300 active:ring-0"
        name="unit"
        value="metric"
        id="metric"
        checked
      />
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
      <input
        type="radio"
        class="active:svale-90 border-none bg-none text-amber-400 ring-amber-50 transition-all checked:bg-amber-400 hover:ring-0 hover:checked:bg-amber-500 focus:ring-0 active:bg-amber-300 active:ring-0"
        name="email"
        value="on"
        id="email-on"
        checked
      />
      <label for="email-on">on</label>
      <input
        type="radio"
        class="active:svale-90 border-none bg-none text-amber-400 ring-amber-50 transition-all checked:bg-amber-400 hover:ring-0 hover:checked:bg-amber-500 focus:ring-0 active:bg-amber-300 active:ring-0"
        name="email"
        value="off"
        id="email-off"
      />
      <label for="email-off">off</label>
    </div>
  </div>
</div>

<style>
  .valid {
    @apply font-medium text-lime-600/60;
  }
</style>
