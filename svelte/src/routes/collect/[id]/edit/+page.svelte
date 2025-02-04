<script lang="ts">
  import { enhance } from "$app/forms";
  import { CancelButton, DangerButton, SubmitButton } from "$lib/components";
  import { notification } from "$lib/stores";

  let { data } = $props();
  let { ingredient } = data;
  let isSubmitting = $state();
</script>

<form
  action="?/update"
  method="POST"
  class="my-4 flex size-full flex-col"
  use:enhance={() => {
    isSubmitting = true;

    return async ({ result, update }) => {
      isSubmitting = false;
      if (result.type === "success") {
        notification.set({ message: "Update Saved", type: "success" });
        update();
      } else if (result.type === "redirect") {
        notification.set({ message: "Deleted", type: "success" });
        update();
      } else if (result.type === "error") {
        notification.set({
          message: String(result.error?.message) || "Something's off",
          type: "error",
        });
      }
    };
  }}
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
          <label class="text-xl font-semibold text-stone-900" for="commonName"
            >Common Name</label
          >
          <input
            name="commonName"
            type="text"
            value={ingredient.commonName}
            class="focus:border-peach-500 focus:ring-peach-500 mt-2 w-full rounded-md border-stone-300 p-3 text-lg text-stone-700 shadow-sm"
            placeholder="Enter ingredient name..."
          />
        </div>
        <div>
          <label class="text-xl font-semibold text-stone-900" for="cas"
            >CAS Number</label
          >
          <input
            name="cas"
            type="text"
            value={ingredient.cas}
            class="focus:border-peach-500 focus:ring-peach-500 mt-2 w-full rounded-md border-stone-300 p-3 text-lg text-stone-700 shadow-sm"
            placeholder="Enter CAS Number..."
          />
        </div>
      </div>

      <!-- Description -->
      <div class="rounded-lg bg-white p-6 shadow-sm">
        <label class="text-xl font-semibold text-stone-900" for="description"
          >Description</label
        >
        <textarea
          name="markdown"
          value={ingredient.markdown}
          rows="5"
          class="focus:border-peach-500 focus:ring-peach-500 mt-2 w-full rounded-md border-stone-300 p-3 text-lg text-stone-700 shadow-sm"
          placeholder="Enter description..."
        ></textarea>
      </div>
    </div>

    <!-- Right Column - Additional Info -->
    <div class="lg:col-span-1">
      <!-- Also Known As -->
      <div class="rounded-lg bg-white p-6 shadow-sm">
        <label class="text-xl font-semibold text-stone-900" for="otherNames"
          >Also Known As</label
        >
        <input
          name="otherNames"
          type="text"
          value={ingredient.otherNames}
          class="focus:border-peach-500 focus:ring-peach-500 mt-2 w-full rounded-md border-stone-300 p-3 text-lg text-stone-700 shadow-sm"
          placeholder="Comma-separated alternative names..."
        />
      </div>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="mt-8 flex justify-end space-x-4">
    <CancelButton></CancelButton>
    <DangerButton>Delete</DangerButton>
    <SubmitButton colour="peach">Save Changes</SubmitButton>
  </div>
</form>
