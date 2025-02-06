<script lang="ts">
  import { enhance } from "$app/forms";
  import {
    SubmitButton,
    CancelButton,
    HeaderMerger,
    Input,
    Label,
  } from "$lib/components";
  import { notification } from "$lib/stores";

  let { data } = $props();
  let { ingredient } = data;

  let isSubmitting = $state(false);
</script>

<form
  method="POST"
  class="flex size-full flex-col"
  use:enhance={() => {
    isSubmitting = true;
    return async ({ result, update }) => {
      isSubmitting = false;
      if (result.type === "redirect") {
        notification.set({ message: "Suggestion Sent", type: "success" });
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

  <HeaderMerger colour="ultra">
    {ingredient.commonName || "Unnamed Ingredient"}
  </HeaderMerger>

  <div class="space-y-6">
    <!-- Common Name & CAS Number -->
    <div
      class="flex space-x-4 rounded-lg bg-white p-6 shadow-sm dark:bg-stone-900"
    >
      <div class="w-1/2">
        <Label>Common Name</Label>
        <Input
          colour="ultra"
          placeholder="Enter ingredient name..."
          name="commonName"
          value={ingredient.commonName}
          type="text"
        />
      </div>
      <div class="w-1/2">
        <Label>CAS Number</Label>
        <Input
          colour="ultra"
          placeholder="Enter CAS number..."
          name="cas"
          value={ingredient.cas}
          type="text"
        />
      </div>
    </div>

    <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-stone-900">
      <Label>Tell us what needs to change</Label>
      <Input
        colour="ultra"
        placeholder="What do you think should change?"
        name="markdown"
        value={ingredient.ingDescription}
        type="textarea"
      />
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="mt-8 flex justify-end space-x-4">
    <CancelButton />
    <SubmitButton>Send Suggestion</SubmitButton>
  </div>
</form>
