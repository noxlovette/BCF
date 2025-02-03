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
    class="border-navy-500 flex w-full flex-col items-center space-y-2 border-b-2 py-4 md:border-b-3 md:py-6 xl:border-b-4"
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

      <!-- Description -->
      <div class="rounded-lg bg-white p-6 shadow-sm">
        <label class="text-xl font-semibold text-stone-900" for="ingDescription"
          >Description</label
        >
        <textarea
          name="ingDescription"
          value={ingredient.ingDescription}
          rows="5"
          class="focus:border-navy-500 focus:ring-navy-500 mt-2 w-full rounded-md border-stone-300 p-3 text-lg text-stone-700 shadow-sm"
          placeholder="Enter description..."
        ></textarea>
      </div>

      <!-- Origin -->
      <div class="rounded-lg bg-white p-6 shadow-sm">
        <label class="text-xl font-semibold text-stone-900" for="origin"
          >Origin</label
        >
        <input
          name="origin"
          type="text"
          value={ingredient.origin}
          class="focus:border-navy-500 focus:ring-navy-500 mt-2 w-full rounded-md border-stone-300 p-3 text-lg text-stone-700 shadow-sm"
          placeholder="Enter ingredient origin..."
        />
      </div>
    </div>

    <!-- Right Column - Additional Info -->
    <div class="space-y-6 lg:col-span-1">
      <!-- Also Known As -->
      <div class="rounded-lg bg-white p-6 shadow-sm">
        <label class="text-xl font-semibold text-stone-900" for="otherNames"
          >Also Known As</label
        >
        <input
          name="otherNames"
          type="text"
          value={ingredient.otherNames}
          class="focus:border-navy-500 focus:ring-navy-500 mt-2 w-full rounded-md border-stone-300 p-3 text-lg text-stone-700 shadow-sm"
          placeholder="Comma-separated alternative names..."
        />
      </div>

      <!-- Volatility -->
      <div class="rounded-lg bg-white p-6 shadow-sm">
        <label class="text-xl font-semibold text-stone-900" for="volatility"
          >Volatility</label
        >
        <select
          name="volatility"
          class="focus:border-navy-500 focus:ring-navy-500 mt-2 w-full rounded-md border-stone-300 p-3 text-lg text-stone-700 shadow-sm"
        >
          <option value="Base" selected={ingredient.volatility === "Base"}
            >Base</option
          >
          <option value="Heart" selected={ingredient.volatility === "Heart"}
            >Heart</option
          >
          <option value="Head" selected={ingredient.volatility === "Head"}
            >Head</option
          >
        </select>
      </div>

      <!-- IFRA Status -->
      <div class="rounded-lg bg-white p-6 shadow-sm">
        <label class="text-xl font-semibold text-stone-900" for="ifraStatus"
          >IFRA Status</label
        >
        <input
          name="ifraStatus"
          type="text"
          value={ingredient.ifraStatus}
          class="focus:border-navy-500 focus:ring-navy-500 mt-2 w-full rounded-md border-stone-300 p-3 text-lg text-stone-700 shadow-sm"
          placeholder="Enter IFRA status..."
        />
      </div>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="mt-8 flex justify-end space-x-4">
    <a
      href="."
      class="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition-colors duration-200 hover:bg-stone-100 focus:ring-2 focus:ring-stone-500"
    >
      Cancel
    </a>
    <button
      type="submit"
      class="bg-navy-600 hover:bg-navy-700 text-navy-50 focus:ring-navy-500 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors duration-200 focus:ring-2"
    >
      Send Suggestion
    </button>
  </div>
</form>
