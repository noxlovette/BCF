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
  let { ingredientComposite } = data;
  let { ingredient } = ingredientComposite;

  let isSubmitting = $state(false);
</script>

<form
  method="POST"
  class="flex size-full flex-col space-y-6"
  use:enhance={() => {
    isSubmitting = true;
    return async ({ result, update }) => {
      isSubmitting = false;
      if (result.type === "redirect") {
        notification.set({ message: "Edit Sent", type: "success" });
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

  <!-- Common Name & CAS Number -->
  <div class="space-y-4 rounded-lg bg-white p-6 shadow-sm dark:bg-stone-800">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <Label>Common Name</Label>
        <Input
          colour="ultra"
          placeholder="Enter ingredient name..."
          name="commonName"
          value={ingredient.commonName}
          type="text"
        />
      </div>
      <div>
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

    <div>
      <Label>Also Known As</Label>
      <Input
        colour="wine"
        placeholder="Colon-separated alternative names..."
        name="otherNames"
        value={ingredient.otherNames}
        type="text"
      />
    </div>
  </div>

  <!-- Description -->
  <div class="rounded-lg bg-white p-6 shadow-sm dark:bg-stone-800">
    <Label>Description</Label>
    <Input
      colour="ultra"
      placeholder="What do you think should change?"
      name="ingDescription"
      value={ingredient.ingDescription}
      type="textarea"
    />
  </div>

  <!-- Additional Information -->
  <div class="grid grid-cols-2 gap-4">
    <div>
      <Label>Volatility</Label>
      <Input
        colour="ultra"
        placeholder="Volatility"
        name="volatility"
        value={ingredient.volatility}
        type="text"
      />
    </div>
    <div>
      <Label>IFRA Status</Label>
      <Input
        colour="ultra"
        placeholder="IFRA"
        name="isRestricted"
        value={ingredient.isRestricted}
        type="checkbox"
      />
    </div>
    <div class="col-span-2">
      <Label>Origin</Label>
      <Input
        colour="ultra"
        placeholder="Origin"
        name="origin"
        value={ingredient.origin}
        type="text"
      />
    </div>
  </div>

  <div></div>

  <!-- Action Buttons -->
  <div class="mt-8 flex justify-end space-x-4">
    <CancelButton />
    <SubmitButton>Done</SubmitButton>
  </div>
</form>
