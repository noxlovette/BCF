<script lang="ts">
  import { notification, clearNotification } from "$lib/stores";
  import { fly } from "svelte/transition";
  import { quintInOut } from "svelte/easing";
  import { Check, AlertCircle, X } from "lucide-svelte";
  import type { Toast } from "$lib/types";
  import { onDestroy } from "svelte";

  let timeout: ReturnType<typeof setTimeout> | null = null;

  $effect(() => {
    if ($notification.message) {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        clearNotification(); // Reset the notification store
      }, 2800);
    }
  });

  onDestroy(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
  });
</script>

{#snippet icon(type: Toast["type"])}
  {#if type === "success"}
    <Check
      class="text-pakistan-700 size-5 rounded-full bg-stone-100 p-1 lg:size-6 dark:bg-inherit dark:ring-2 dark:ring-stone-800"
    />
  {:else if type === "error"}
    <X
      class="size-5 rounded-full bg-stone-100 p-1 text-red-700 lg:size-6 dark:bg-inherit  dark:ring-2 dark:ring-stone-800"
    />
  {:else}
    <AlertCircle
      class="text-brick-700 size-5 rounded-full bg-stone-100 p-1 lg:size-6 dark:bg-inherit  dark:ring-2 dark:ring-stone-800"
    />
  {/if}
{/snippet}

{#if $notification.message}
  <div
    transition:fly={{
      duration: 300,
      easing: quintInOut,
      x: 0,
      y: 100,
    }}
    class="fixed bottom-5 left-1/2 z-50 flex max-w-md min-w-[200px] -translate-x-1/2 items-center gap-6
			rounded-full bg-stone-50 px-4 py-2 ring-1 shadow-md dark:bg-stone-900 {$notification.type ===
    'success'
      ? 'ring-pakistan-700'
      : $notification.type === 'error'
        ? 'ring-red-700'
        : 'ring-amber-700'}"
  >
    {@render icon($notification.type)}

    <p
      class="flex text-sm font-bold

		text-stone-800 dark:text-inherit
		"
    >
      {$notification.message}
    </p>
  </div>
{/if}
