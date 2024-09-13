<script lang="ts">
  import type { PageServerData } from "./$types";
  import { notification } from "$lib/stores";
  import MetaData from "$lib/components/MetaData.svelte";
  import AppWrap from "$lib/components/AppWrap.svelte";
  import { enhance } from "$app/forms";

  import { writable } from "svelte/store";

  import Label from "$lib/components/UI/Label.svelte";
  import VariableInput from "$lib/components/UI/VariableInput.svelte";
  import VariableTextarea from "$lib/components/UI/VariableTextarea.svelte";
    import { setContext } from "svelte";
    import { user } from "$lib/stores";

  export let data: PageServerData;

  const editing = writable(false);
  setContext("editing", editing);

  let ingredient: App.IngredientBrowse = data.ingredient;
  let suggestion: App.IngredientBrowse = ingredient;

  const unsplashData = data.photo;
  const href = `https://unsplash.com/@${unsplashData.user.username}?utm_source=bcf&utm_medium=referral`;

  let volatility = ingredient.volatility || "Unknown";
  let useMessage =
    ingredient.use || "Nobody has told us how to use this ingredient yet";
  let relatedIngredients =
    Array.isArray(ingredient.related_ingredients) &&
    ingredient.related_ingredients.length > 0
      ? ingredient.related_ingredients
      : [{"common_name":"Nobody knows", "slug":""}];
  let origin = ingredient.origin || "Earth";
  let otherNames = ingredient.other_names || "Nobody knows";
  let ifraStatus =
    ingredient.is_restricted === true ? "Restricted" : "Not restricted";

  const description = `Discover ${ingredient.common_name}. ${ingredient.use}. Explore similar ingredients and fragrances at BCF.`;
  const keywords = `${ingredient.common_name}, ${ingredient.descriptors}, ${ingredient.other_names}, ${ingredient.cas}, ${ingredient.origin}, ${ingredient.volatility}, fragrance, BCF, ingredient, perfume, perfumery`;


</script>

<MetaData
  title={ingredient.common_name}
  {description}
  {keywords}
  ogUrl={`https://bcfapp.app/browse/${ingredient.slug}`}
/>

<AppWrap
  class="select-text justify-between caret-aqua-700 selection:bg-aqua-700 selection:text-aqua-50"
>
  <div
    id="header"
    class="flex w-full flex-row items-baseline justify-between border-b-2 border-stone-500 pb-4 font-medium xl:border-b-4"
  >
    <div class="w-full">
      <h1 class="">
        <VariableInput
          text={ingredient.common_name}
          bind:value={suggestion.common_name}
          class="font-quicksand text-7xl font-medium"
        />
      </h1>
    </div>
    <div
      id="controls"
      class="flex flex-row items-baseline justify-end space-x-4 font-medium xl:text-2xl"
    >
      {#if $editing}
        <button
          type="submit"
          class="rounded border-2 border-stone-500 px-6 py-2"
          on:click={() => editing.set(false)}
        >
          Cancel
        </button>
        <form method="post" action="?/suggest" class="" use:enhance={() =>
    notification.set({ message: "suggestion sent", type: "success" })}>
          <input type="hidden" name="ingredient" value={suggestion.id} />
          <input type="hidden" name="common_name" bind:value={suggestion.common_name} />
          <input type="hidden" name="cas" bind:value={suggestion.cas} />
          <input type="hidden" name="use" bind:value={suggestion.use} />
          <input type="hidden" name="is_restricted" bind:value={suggestion.is_restricted} />
          <input type="hidden" name="origin" bind:value={suggestion.origin} />
          <input type="hidden" name="similar_ingredients" bind:value={suggestion.related_ingredients} />
          <input type="hidden" name="other_names" bind:value={suggestion.other_names} />
          <input type="hidden" name="volatility" bind:value={suggestion.volatility} />

          <button
            type="submit"
            class="rounded border-2 border-stone-500 px-6 py-2"
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
          <button disabled={!$user.is_authenticated} class="rounded border-2 border-stone-500 px-6 py-2 disabled:text-stone-400 disabled:border-stone-300">
            Add
          </button>
        </form>
        <button disabled={!$user.is_authenticated}
          on:click={() => editing.set(!$editing)}
          class="rounded border-2 border-stone-500 px-6 py-2 disabled:text-stone-400 disabled:border-stone-300"
        >
          Edit
        </button>
      {/if}
    </div>
  </div>

  <div id="center" class="flex flex-row justify-between py-4">
    <div id="left-part" class="flex w-2/3 flex-col space-y-8 pr-8">
      <div class="flex flex-row space-x-8">
        <div>
          <Label>descriptors</Label>
          <VariableTextarea
            text={ingredient.descriptors}
            bind:value={suggestion.descriptors}
            class="font-medium xl:text-2xl"
          />
        </div>
        <div>
          <Label>CAS</Label>
          <VariableInput
            text={ingredient.cas}
            bind:value={suggestion.cas}
            class="font-medium xl:text-2xl"
          />
        </div>
      </div>
      <div>
        <Label>how to use it</Label>
        <VariableTextarea
          text={useMessage}
          bind:value={suggestion.use}
          class="min-h-36 font-medium xl:text-2xl"
        />
      </div>
      <div class="flex flex-col space-y-4">
        <div class="flex w-full max-w-2xl space-x-8">
          <div>
            <Label>volatility</Label>
            <VariableInput
              text={volatility}
              bind:value={suggestion.is_restricted}
              class="font-medium xl:text-2xl"
            />
          </div>
          <div>
            <Label>restricted</Label>
            <VariableInput
              text={ifraStatus}
              bind:value={suggestion.is_restricted}
              class="font-medium xl:text-2xl"
            />
          </div>
          <div>
            <Label>origin</Label>
            <VariableInput
              text={origin}
              bind:value={suggestion.origin}
              class="font-medium xl:text-2xl"
            />
          </div>
        </div>
        <div>
          <Label>related</Label>
          {#if $editing}
          <input
          type="text"
          bind:value={suggestion.related_ingredients}
          placeholder="related ingredients"
          class="rounded border-none font-medium xl:text-2xl border-stone-500 bg-transparent p-0 ring-0 focus:border-stone-500 focus:ring-0 dark:bg-stone-800
          "
          />
          {:else}
          {#each relatedIngredients as related}
            <a class="font-medium xl:text-2xl hover:text-aqua-700 transition-colors" href="/browse/{related.slug}" data-sveltekit-reload>
              {related.common_name};
            </a>
            {/each}
          {/if}

        </div>
        <div>
          <Label>also known as</Label>
          <VariableTextarea
            text={otherNames}
            bind:value={suggestion.other_names}
            class=""
          />
        </div>
      </div>
    </div>

    <div id="right-part" class="relative flex-1 overflow-hidden">
      {#if unsplashData}
        <img
          alt={ingredient.common_name}
          src={unsplashData.urls.regular}
          class="aspect-square h-full w-full rounded object-cover"
        />
        <p
          class="absolute bottom-2 right-2 rounded bg-stone-50 px-2 py-1 text-sm italic text-stone-900 bg-blend-screen"
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

