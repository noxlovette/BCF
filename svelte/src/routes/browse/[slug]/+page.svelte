<script lang="ts">
  import type { PageServerData } from "./$types";
  import { notification } from "$lib/stores";
  import MetaData from "$lib/components/MetaData.svelte";
  import AppWrap from "$lib/components/AppWrap.svelte";
  import { enhance } from "$app/forms";
  import type { IngredientBrowse } from "$lib/types";

  import { writable } from "svelte/store";

  import Label from "$lib/components/UI/Label.svelte";
  import VariableInput from "$lib/components/UI/VariableInput.svelte";
  import VariableTextarea from "$lib/components/UI/VariableTextarea.svelte";
  import { setContext } from "svelte";
  import { user } from "$lib/stores";

  const editing = writable(false);
  setContext("editing", editing);

  let { data } = $props();
  let ingredient: IngredientBrowse = data.ingredient;
  let suggestion: IngredientBrowse = ingredient;

  console.log(data);

  const unsplashData = data.photo;
  let href = $state("https://unsplash.com");
  if (data.photo) {
    href = `https://unsplash.com/@${unsplashData.user.username}?utm_source=bcf&utm_medium=referral`;
  }

  let volatility = ingredient.volatility || "Unknown";
  let useMessage =
    ingredient.use || "Nobody has told us how to use this ingredient yet";
  let relatedIngredients =
    Array.isArray(ingredient.relatedIngredients) &&
    ingredient.relatedIngredients.length > 0
      ? ingredient.relatedIngredients
      : [{ commonName: "Nobody knows", slug: "" }];
  let origin = ingredient.origin || "Earth";
  let otherNames = ingredient.otherNames || "Nobody knows";
  let ifraStatus =
    ingredient.isRestricted === true ? "Restricted" : "Not restricted";

  const description = `Discover ${ingredient.commonName}. ${ingredient.descriptors}. Explore similar ingredients and fragrances at BCF.`;
  const keywords = `${ingredient.commonName}, ${ingredient.descriptors}, ${ingredient.otherNames}, ${ingredient.cas}, ${ingredient.origin}, ${volatility}, fragrance, BCF, ingredient, perfume, perfumery`;
</script>

<MetaData
  title={ingredient.commonName}
  {description}
  {keywords}
  ogUrl={`https://bcfapp.app/browse/${ingredient.slug}`}
/>

<AppWrap
  class="caret-navy-700 selection:bg-navy-700 selection:text-navy-50 justify-between select-text"
>
  <div
    id="header"
    class="border-navy-500 flex w-full flex-col-reverse items-baseline justify-between space-y-2 border-b-2 md:flex-row md:space-y-0 md:pb-4 xl:border-b-4"
  >
    <div class="my-4 w-full md:my-0">
      <h1 class="">
        <VariableInput
          text={ingredient.commonName}
          bind:value={suggestion.commonName}
          class="font-quicksand text-3xl font-bold md:text-4xl lg:text-5xl xl:text-7xl"
        />
      </h1>
    </div>
    <div
      id="controls"
      class="flex flex-row items-baseline justify-end space-x-2 lg:space-x-4 xl:text-2xl"
    >
      {#if $editing}
        <button
          type="submit"
          class="rounded border-2 border-stone-500 px-2 py-1 lg:px-6 lg:py-2"
          onclick={() => editing.set(false)}
        >
          Cancel
        </button>
        <form
          method="post"
          action="?/suggest"
          class=""
          use:enhance={() =>
            notification.set({ message: "suggestion sent", type: "success" })}
        >
          <input type="hidden" name="ingredient" value={suggestion.id} />
          <input
            type="hidden"
            name="commonName"
            bind:value={suggestion.commonName}
          />
          <input type="hidden" name="cas" bind:value={suggestion.cas} />
          <input type="hidden" name="use" bind:value={suggestion.use} />
          <input
            type="hidden"
            name="isRestricted"
            bind:value={suggestion.isRestricted}
          />
          <input type="hidden" name="origin" bind:value={suggestion.origin} />
          <input
            type="hidden"
            name="similar_ingredients"
            bind:value={suggestion.relatedIngredients}
          />
          <input
            type="hidden"
            name="otherNames"
            bind:value={suggestion.otherNames}
          />
          <input
            type="hidden"
            name="volatility"
            bind:value={suggestion.volatility}
          />

          <button
            type="submit"
            class="rounded border-2 border-stone-500 px-2 py-1 lg:px-6 lg:py-2"
          >
            Save
          </button>
        </form>
      {:else}
        <form
          method="post"
          action="?/add"
          use:enhance={() =>
            notification.set({
              message: "Added to your collection",
              type: "success",
            })}
        >
          <input type="hidden" name="id" value={ingredient.id} />
          <button
            disabled={!$user.is_authenticated}
            class="rounded border-2 border-stone-500 px-2 py-1 disabled:border-stone-300 disabled:text-stone-400 lg:px-6 lg:py-2"
          >
            Add
          </button>
        </form>
        <button
          disabled={!$user.is_authenticated}
          onclick={() => editing.set(!$editing)}
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
        class="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-8"
      >
        <div>
          <Label>descriptors</Label>
          <VariableTextarea
            text={ingredient.descriptors}
            bind:value={suggestion.descriptors}
            class=" xl:text-2xl"
          />
        </div>
        <div>
          <Label>CAS</Label>
          <VariableInput
            text={ingredient.cas}
            bind:value={suggestion.cas}
            class=" xl:text-2xl"
          />
        </div>
      </div>
      <div>
        <Label>how to use it</Label>
        <VariableTextarea
          text={useMessage}
          bind:value={suggestion.use}
          class="min-h-24  md:min-h-36 xl:text-2xl"
        />
      </div>
      <div class="flex flex-col space-y-4">
        <div
          class="flex w-full max-w-2xl flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-8"
        >
          <div>
            <Label>volatility</Label>
            <VariableInput
              text={volatility}
              bind:value={suggestion.isRestricted}
              class=" xl:text-2xl"
            />
          </div>
          <div>
            <Label>restricted</Label>
            <VariableInput
              text={ifraStatus}
              bind:value={suggestion.isRestricted}
              class=" xl:text-2xl"
            />
          </div>
          <div>
            <Label>origin</Label>
            <VariableInput
              text={origin}
              bind:value={suggestion.origin}
              class=" xl:text-2xl"
            />
          </div>
        </div>
        <div>
          <Label>related</Label>
          {#if $editing}
            <input
              type="text"
              bind:value={suggestion.relatedIngredients}
              placeholder="related ingredients"
              class="rounded border-none border-stone-500 bg-transparent p-0 ring-0 focus:border-stone-500 focus:ring-0 xl:text-2xl dark:bg-stone-800
          "
            />
          {:else}
            {#each relatedIngredients as related}
              <a
                class="hover:text-aqua-700 transition-colors xl:text-2xl"
                href="/browse/{related.slug}"
                data-sveltekit-reload
              >
                {related.commonName};
              </a>
            {/each}
          {/if}
        </div>
        <div>
          <Label>also known as</Label>
          <VariableTextarea
            text={otherNames}
            bind:value={suggestion.otherNames}
            class=""
          />
        </div>
      </div>
    </div>

    <div id="right-part" class="relative flex-1 overflow-hidden">
      {#if unsplashData}
        <img
          alt={ingredient.commonName}
          src={unsplashData.urls.regular}
          class="aspect-square h-full w-full rounded object-cover"
        />
        <p
          class="absolute right-2 bottom-2 rounded bg-stone-50 px-2 py-1 text-sm text-stone-900 italic bg-blend-screen"
        >
          Photo by <a {href}>{unsplashData.user.name}</a> on
          <a href="https://unsplash.com/?utm_source=bcf&utm_medium=referral"
            >Unsplash</a
          >
        </p>
      {/if}
    </div>
  </div>
</AppWrap>
