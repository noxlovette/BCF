<script lang="ts">
  import { derived } from "svelte/store";
  import { notification } from "$lib/stores";
  import { fade } from "svelte/transition";

  const notificationStore = derived(
    notification,
    ($notification) => $notification,
  );

  let timeout;

  $: if ($notification.message) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      notification.set({ message: null, type: null });
    }, 2800);
  }
</script>

{#if $notification.message}
  <div
    class={`fixed bottom-8 left-1/2 z-50 -translate-x-1/2 transform rounded-lg p-4 text-center text-stone-50 shadow-lg ${$notification.message ? "block" : "hidden"}  ${
      $notification.type === "error"
        ? "bg-peach-700"
        : $notification.type === "success"
          ? "bg-aqua-700"
          : $notification.type === "info"
            ? "bg-navy-700"
            : "bg-stone-500"
    }`}
    role="alert"
    in:fade={{ duration: 150 }}
    out:fade={{ duration: 300 }}
  >
    {$notification.message}
  </div>
{/if}
