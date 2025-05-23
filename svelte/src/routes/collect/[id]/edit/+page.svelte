<script lang="ts">
  import { enhance } from "$app/forms";
  import {
    CancelButton,
    DangerButton,
    HeaderMerger,
    SubmitButton,
    Input,
    Label,
    MetaData,
  } from "$lib/components";
  import { notification } from "$lib/stores";

  let { data } = $props();
  let { ingredient } = data;
  let isSubmitting = $state();
</script>

<MetaData
  title={`${ingredient.commonName} | Collect`}
  robots="noindex, nofollow"
/>

<form
  action="?/update"
  method="POST"
  class="flex size-full flex-col"
  use:enhance={() => {
    isSubmitting = true;

    return async ({ result, update }) => {
      isSubmitting = false;
      if (result.type === "redirect") {
        notification.set({ message: "Done", type: "success" });
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
  <HeaderMerger colour="wine">
    {ingredient.commonName || "Unnamed Ingredient"}
  </HeaderMerger>

  <!-- Form Grid -->
  <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
    <!-- Left Column - Main Info -->
    <div class="space-y-6 lg:col-span-2">
      <!-- Common Name -->
      <div
        class="flex space-x-4 bg-white p-6 shadow-sm md:rounded-lg dark:bg-stone-800"
      >
        <div>
          <Label>Common Name</Label>
          <Input
            colour="wine"
            placeholder="Enter CAS number..."
            name="commonName"
            value={ingredient.commonName}
            type="text"
          />
        </div>
        <div>
          <Label>CAS Number</Label>
          <Input
            colour="wine"
            placeholder="Enter CAS number..."
            name="cas"
            value={ingredient.cas}
            type="text"
          />
        </div>
      </div>

      <!-- Description -->
      <div class="bg-white p-6 shadow-sm md:rounded-lg dark:bg-stone-800">
        <Label>Description</Label>
        <Input
          colour="wine"
          placeholder="Enter description..."
          name="markdown"
          value={ingredient.markdown}
          type="textarea"
        />
      </div>
    </div>

    <!-- Right Column - Additional Info -->
    <div class="flex flex-col gap-6 lg:col-span-1">
      <!-- Also Known As -->
      <div class="bg-white p-6 shadow-sm md:rounded-lg dark:bg-stone-800">
        <Label>Also Known As</Label>
        <Input
          colour="wine"
          placeholder="Colon-separated alternative names..."
          name="otherNames"
          value={ingredient.otherNames}
          type="text"
        />
      </div>
      <div
        class="flex flex-1 flex-col bg-white p-6 shadow-sm md:rounded-lg dark:bg-stone-800"
      >
        <h2 class="mb-3 text-xl font-semibold dark:text-stone-500">
          Ingredient Details
        </h2>

        <div class="flex items-center justify-between">
          <div>
            <span class=" dark:text-stone-300">Available</span>
            <div class="inline-flex items-end space-x-2">
              <Input
                colour="wine"
                placeholder="How much in stock"
                name="amount"
                bind:value={ingredient.amount}
                type="number"
              />
              <span class="font-semibold dark:text-stone-100"
                >{ingredient.unit}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="mt-8 flex justify-end space-x-4">
    <SubmitButton colour="wine">Save Changes</SubmitButton>
    <CancelButton></CancelButton>
    <DangerButton>Delete</DangerButton>
  </div>
</form>
