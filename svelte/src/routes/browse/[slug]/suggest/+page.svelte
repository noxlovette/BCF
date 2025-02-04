<script lang="ts">
  import { enhance } from "$app/forms";
  import { SubmitButton, CancelButton } from "$lib/components";

  let { data } = $props();
  let { ingredient } = data;
</script>

<form method="POST" class="my-4 flex size-full flex-col" use:enhance>
  <input type="hidden" name="id" value={ingredient.id} />

  <div
    class="border-navy-500 flex w-full flex-col items-center space-y-2 border-b-2 py-4 md:border-b-3 md:py-6 xl:border-b-4"
  >
    <h1
      class="font-manrope text-center text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl xl:text-7xl"
    >
      Editing: {ingredient.commonName || "Unnamed Ingredient"}
    </h1>
  </div>

  <div class="my-4 space-y-6">
    <!-- Common Name & CAS Number -->
    <div class="flex space-x-4 rounded-lg bg-white p-6 shadow-sm">
      <div class="w-1/2">
        <label class="text-xl font-semibold text-stone-900" for="commonName"
          >Common Name</label
        >
        <input
          name="commonName"
          type="text"
          value={ingredient.commonName}
          class="focus:border-navy-500 focus:ring-navy-500 mt-2 w-full rounded-md border-stone-300 p-3 text-lg text-stone-700 shadow-sm"
          placeholder="Enter ingredient name..."
        />
      </div>
      <div class="w-1/2">
        <label class="text-xl font-semibold text-stone-900" for="cas"
          >CAS Number</label
        >
        <input
          name="cas"
          type="text"
          value={ingredient.cas}
          class="focus:border-navy-500 focus:ring-navy-500 mt-2 w-full rounded-md border-stone-300 p-3 text-lg text-stone-700 shadow-sm"
          placeholder="Enter CAS Number..."
        />
      </div>
    </div>

    <div class="rounded-lg bg-white p-6 shadow-sm">
      <label class="text-xl font-semibold text-stone-900" for="ingDescription"
        >Tell us what needs to change</label
      >
      <textarea
        name="markdown"
        value={ingredient.ingDescription}
        rows="5"
        class="focus:border-navy-500 focus:ring-navy-500 mt-2 w-full rounded-md border-stone-300 p-3 text-lg text-stone-700 shadow-sm"
        placeholder="Enter your suggestions..."
      ></textarea>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="mt-8 flex justify-end space-x-4">
    <CancelButton />
    <SubmitButton>Send Suggestion</SubmitButton>
  </div>
</form>
