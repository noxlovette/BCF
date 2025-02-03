<script lang="ts">
  import { enhance } from "$app/forms";

  let { data } = $props();
  let { ingredient } = data;
</script>

<form
  action="?/update"
  method="POST"
  class="my-4 flex size-full flex-col"
  use:enhance
>
  <input type="hidden" name="id" value={ingredient.id} />

  <div
    class="border-peach-500 flex w-full flex-col items-center space-y-2 border-b-2 py-4 md:border-b-3 md:py-6 xl:border-b-4"
  >
    <h1
      class="font-manrope text-center text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl xl:text-7xl"
    >
      Editing: {ingredient.commonName || "Unnamed Ingredient"}
    </h1>
  </div>

  <!-- Form Grid -->
  <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
    <!-- Left Column - Main Info -->
    <div class="space-y-6 lg:col-span-2">
      <!-- Common Name -->
      <div class="flex space-x-4 rounded-lg bg-white p-6 shadow-sm">
        <div>
          <label class="text-xl font-semibold text-zinc-900" for="commonName"
            >Common Name</label
          >
          <input
            name="commonName"
            type="text"
            value={ingredient.commonName}
            class="focus:border-peach-500 focus:ring-peach-500 mt-2 w-full rounded-md border-zinc-300 p-3 text-lg text-zinc-700 shadow-sm"
            placeholder="Enter ingredient name..."
          />
        </div>
        <div>
          <label class="text-xl font-semibold text-zinc-900" for="cas"
            >CAS Number</label
          >
          <input
            name="cas"
            type="text"
            value={ingredient.cas}
            class="focus:border-peach-500 focus:ring-peach-500 mt-2 w-full rounded-md border-zinc-300 p-3 text-lg text-zinc-700 shadow-sm"
            placeholder="Enter CAS Number..."
          />
        </div>
      </div>

      <!-- Description -->
      <div class="rounded-lg bg-white p-6 shadow-sm">
        <label class="text-xl font-semibold text-zinc-900" for="description"
          >Description</label
        >
        <textarea
          name="markdown"
          value={ingredient.markdown}
          rows="5"
          class="focus:border-peach-500 focus:ring-peach-500 mt-2 w-full rounded-md border-zinc-300 p-3 text-lg text-zinc-700 shadow-sm"
          placeholder="Enter description..."
        ></textarea>
      </div>
    </div>

    <!-- Right Column - Additional Info -->
    <div class="lg:col-span-1">
      <!-- Also Known As -->
      <div class="rounded-lg bg-white p-6 shadow-sm">
        <label class="text-xl font-semibold text-zinc-900" for="otherNames"
          >Also Known As</label
        >
        <input
          name="otherNames"
          type="text"
          value={ingredient.otherNames}
          class="focus:border-peach-500 focus:ring-peach-500 mt-2 w-full rounded-md border-zinc-300 p-3 text-lg text-zinc-700 shadow-sm"
          placeholder="Comma-separated alternative names..."
        />
      </div>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="mt-8 flex justify-end space-x-4">
    <a
      href="."
      class="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors duration-200 hover:bg-zinc-100 focus:ring-2 focus:ring-zinc-500"
    >
      Cancel
    </a>
    <button
      formaction="?/delete"
      class="
    rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-red-50 shadow-sm transition-colors duration-200 hover:bg-red-700 focus:ring-2 focus:ring-red-500
    "
    >
      Delete
    </button>
    <button
      type="submit"
      class="bg-peach-600 hover:bg-peach-700 text-peach-50 focus:ring-peach-500 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors duration-200 focus:ring-2"
    >
      Save Changes
    </button>
  </div>
</form>
