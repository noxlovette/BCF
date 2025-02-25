<script lang="ts">
  import { fade } from "svelte/transition";
  import type { Suggestion } from "$lib/types";
  import { Label } from "../typography";
  import { enhance } from "$app/forms";

  let { suggestion }: { suggestion: Suggestion } = $props();
</script>

<div
  class="group hover:ring-ultra-400 flex flex-col justify-between
space-y-2 bg-stone-50 p-3
         shadow-sm ring-2 ring-stone-200 transition-all
         hover:shadow-md md:rounded-lg dark:bg-stone-900 dark:ring-stone-900"
  transition:fade
>
  <h2
    class="text-ultra-800 dark:text-ultra-300 mb-2 text-xl
           font-semibold tracking-tight"
  >
    {suggestion.commonName}
  </h2>

  <div class="flex flex-col">
    <Label>Markdown</Label>
    <p>
      {suggestion.markdown}
    </p>
  </div>

  <div class="flex flex-col">
    <Label>status</Label>
    <p>
      {suggestion.status}
    </p>
  </div>

  <input type="hidden" value={suggestion.id} name="suggestion_id" />
  <div class="">
    <button
      formaction="?/approve"
      class="bg-ultra-800 hover:bg-ultra-700 rounded p-1 px-2 transition-colors"
    >
      Approve
    </button>
    <button
      class="rounded bg-red-800 p-1 px-2 transition-colors hover:bg-red-700"
      formaction="?/reject"
    >
      Reject
    </button>
  </div>
</div>
