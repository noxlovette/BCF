<script lang="ts">
  import type { PageServerData } from "./$types";

  import MetaData from "$lib/components/MetaData.svelte";
  import AppWrap from "$lib/components/AppWrap.svelte";
  import { user } from "$lib/stores";

  import { notification } from "$lib/stores";
  import Label from "$lib/components/UI/Label.svelte";
  import VariableInput from "$lib/components/UI/VariableInput.svelte";
  import VariableTextarea from "$lib/components/UI/VariableTextarea.svelte";
  import { writable } from "svelte/store";
  import { setContext } from "svelte";
  import { enhance } from "$app/forms";

  export let data: PageServerData;
  let ingredient: App.IngredientCollection = data.ingredient;
  const editing = writable(false);
  const editedIngredient = writable(ingredient);

  let ifraStatus = ingredient.is_restricted ? "Restricted" : "Not restricted";
  let otherNames = ingredient.other_names || "Unknown";
  let volatility = ingredient.volatility || "Unknown";
  let useMessage =
    ingredient.use || "Nobody has added a use for this ingredient yet";
  let colour = ingredient.colour || "No colour";
  let impression =
    ingredient.impression || "You haven't recorded an impression yet";
  let associations = ingredient.associations || "None";
  let ideas = ingredient.ideas || "You haven't recorded any ideas yet";
  let origin = ingredient.origin || "Earth";
  setContext("editing", editing);

  function handleEnhance() {
    editing.set(false);
    ingredient = $editedIngredient;
    notification.set({ message: "Ingredient Updated", type: "success" });
  }
</script>

<MetaData title={ingredient.common_name} robots="noindex, nofollow" />

<AppWrap
  class="select-text justify-between caret-grapefruit-700 selection:bg-grapefruit-700 selection:text-grapefruit-50"
>
  <form method="post" action="?/update" class="" use:enhance={handleEnhance}>
    <div
      id="header"
      class="flex w-full flex-col-reverse items-baseline
justify-between space-y-2
      border-b-2 border-grapefruit-500 font-medium md:flex-row md:space-y-0 md:pb-4 xl:border-b-4"
    >
      <div class="my-4 w-full md:my-0">
        <h1 class="">
          <VariableInput
            text={ingredient.common_name}
            bind:value={$editedIngredient.common_name}
            name="common_name"
            class="font-quicksand text-3xl font-bold md:text-4xl lg:text-5xl xl:text-7xl"
          />
        </h1>
      </div>
      <div
        id="controls"
        class="flex flex-row items-baseline justify-end space-x-2 font-medium lg:space-x-4 xl:text-2xl"
      >
        {#if $editing}
          <button
            type="submit"
            class="rounded border-2 border-stone-500 px-2 py-1 lg:px-6 lg:py-2"
            on:click={() => editing.set(false)}
          >
            Cancel
          </button>

          <form
            method="post"
            action="?/delete"
            use:enhance={() =>
              notification.set({
                message: `Deleted ${ingredient.common_name}`,
                type: "success",
              })}
          >
            <input type="hidden" name="id" value={ingredient.id} />
            <button
              disabled={!$user.is_authenticated}
              class="rounded border-2 border-stone-500 px-2 py-1 disabled:border-stone-300 disabled:text-stone-400 lg:px-6 lg:py-2"
            >
              Delete
            </button>
          </form>
          <input type="hidden" name="id" value={ingredient.id} />
          <button
            type="submit"
            class="rounded border-2 border-stone-500 px-2 py-1 lg:px-6 lg:py-2"
          >
            Save
          </button>
        {:else}
          <button
            disabled={!$user.is_authenticated}
            on:click={() => editing.set(!$editing)}
            class="rounded border-2 border-stone-500 px-2 py-1 disabled:border-stone-300 disabled:text-stone-400 lg:px-6 lg:py-2"
          >
            Edit
          </button>
        {/if}
      </div>
    </div>

    <div
      id="center"
      class="flex flex-col justify-between space-y-4 py-4 md:flex-row md:space-y-0"
    >
      <div id="left-part" class="flex w-full flex-col space-y-8 pr-8 md:w-2/3">
        <div
          class="flex flex-col space-y-4 md:flex-row md:space-x-8 md:space-y-0"
        >
          <div>
            <Label>descriptors</Label>
            <VariableTextarea
              text={ingredient.descriptors}
              bind:value={$editedIngredient.descriptors}
              name="descriptors"
              class="font-medium xl:text-2xl"
            />
          </div>
          <div>
            <Label>CAS</Label>
            <VariableInput
              text={ingredient.cas}
              name="cas"
              bind:value={$editedIngredient.cas}
              class="font-medium xl:text-2xl"
            />
          </div>
        </div>
        <div>
          <Label>how to use it</Label>
          <VariableTextarea
            text={useMessage}
            bind:value={$editedIngredient.use}
            name="use"
            class="min-h-24 font-medium md:min-h-36 xl:text-2xl"
          />
        </div>
        <div class="flex flex-col space-y-4">
          <div
            class="flex w-full max-w-2xl flex-col space-y-4 md:flex-row md:space-x-8 md:space-y-0"
          >
            <div>
              <Label>volatility</Label>
              <VariableInput
                text={volatility}
                name="volatility"
                bind:value={$editedIngredient.volatility}
                class="font-medium xl:text-2xl"
              />
            </div>
            <div>
              <Label>restricted</Label>
              <VariableInput
                text={ifraStatus}
                name="is_restricted"
                bind:value={$editedIngredient.is_restricted}
                class="font-medium xl:text-2xl"
              />
            </div>
            <div>
              <Label>origin</Label>
              <VariableInput
                text={origin}
                name="origin"
                bind:value={$editedIngredient.origin}
                class="font-medium xl:text-2xl"
              />
            </div>
          </div>

          <div>
            <Label>also known as</Label>
            <VariableTextarea
              text={otherNames}
              name="other_names"
              bind:value={$editedIngredient.other_names}
              class=""
            />
          </div>
        </div>
      </div>
      <div id="right-part" class="flex flex-1 flex-col space-y-8">
        <div
          class="flex flex-col space-y-2 md:flex-row md:space-x-8 md:space-y-0"
        >
          <div>
            <Label>colour</Label>
            <VariableInput
              text={colour}
              name="colour"
              bind:value={$editedIngredient.colour}
              class="font-medium xl:text-2xl"
            />
          </div>
          <div>
            <Label>associations</Label>
            <VariableInput
              text={associations}
              name="associations"
              bind:value={$editedIngredient.associations}
              class="font-medium xl:text-2xl"
            />
          </div>
        </div>
        <div>
          <Label>my impression</Label>
          <VariableTextarea
            text={impression}
            name="impression"
            bind:value={$editedIngredient.impression}
            class="min-h-24 font-medium md:min-h-36 xl:text-2xl"
          />
        </div>

        <div>
          <Label>ideas</Label>
          <VariableTextarea
            text={ideas}
            name="ideas"
            bind:value={$editedIngredient.ideas}
            class="min-h-24 font-medium md:min-h-36 xl:text-2xl"
          />
        </div>
      </div>
    </div>
  </form>
</AppWrap>
