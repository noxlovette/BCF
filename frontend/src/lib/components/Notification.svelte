<script lang="ts">
import { derived } from "svelte/store";
import { notification } from '$lib/stores/notificationStore';
import { fade } from "svelte/transition";

    const notificationStore = derived(notification, ($notification) => $notification);

    let timeout;

  $: if ($notification.message) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      notification.set({message: null, type: null });
    }, 2800);
  }
  </script>
  
  {#if $notification.message}
  <div
    class={`fixed z-50 bottom-8 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg text-white ${$notification.message ? 'block' : 'hidden'}  ${
      $notification.type === "error" ? 'bg-red-500' : $notification.type === 'success' ? 'bg-green-500' : $notification.type === 'info' ? 'bg-blue-500' :  'bg-gray-500'
    }`}
    role="alert"
    in:fade={{ duration: 150 }}
    out:fade={{ duration: 300 }}
  >
    {$notification.message}
  </div>
  {/if}

  