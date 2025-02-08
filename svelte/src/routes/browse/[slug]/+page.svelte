<script lang="ts">
  import {
    EditButton,
    HeaderMerger,
    Label,
    MetaData,
    SubmitButton,
  } from "$lib/components";
  import { enhance } from "$app/forms";
  import { notification } from "$lib/stores";

  let { data } = $props();
  let { ingredient, unsplashData } = data;

  let isSubmitting = $state(false);

  let href = $state("");
  if (unsplashData) {
    href = `https://unsplash.com/@${unsplashData.user.username}?utm_source=bcf&utm_medium=referral`;
  }

  const volatility = ingredient.volatility || "Unknown";
  const useMessage =
    ingredient.ingDescription || "No usage information available";
  const otherNames = ingredient.otherNames || "No alternative names";
  const origin = ingredient.origin || "Not Specified";
  const ifraStatus =
    ingredient.isRestricted === true ? "Restricted" : "Not restricted";

  const description = `Discover ${ingredient.commonName}. ${ingredient.descriptors}. Explore similar ingredients and fragrances.`;
  const keywords = `${ingredient.commonName}, ${ingredient.descriptors}, ${ingredient.otherNames}, ${ingredient.cas}, ${ingredient.origin}, ${volatility}`;
</script>

<MetaData
  title={ingredient.commonName}
  {description}
  {keywords}
  ogUrl={`/browse/${ingredient.slug}`}
/>

<div class="flex size-full flex-col">
  <HeaderMerger colour="ultra">
    {ingredient.commonName}
  </HeaderMerger>

  <!-- Main Content -->
  <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
    <!-- Left Column - Main Info -->
    <div class="space-y-8 lg:col-span-2">
      <!-- Descriptors & CAS -->
      <div class="bg-white p-6 shadow-sm md:rounded-lg dark:bg-stone-900">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label>Descriptors</Label>
            <div
              class="my-2 flex flex-wrap items-center gap-2 text-lg text-stone-600 md:gap-4 md:text-xl xl:text-2xl"
            >
              {#each ingredient.descriptors as descriptor}
                <span
                  class="rounded-md bg-stone-100 px-3 py-1 text-stone-700 shadow-sm dark:bg-stone-700 dark:text-stone-100"
                  >{descriptor}</span
                >
              {/each}
            </div>
          </div>
          <div>
            <Label>CAS Number</Label>
            <div
              class="my-2 flex flex-wrap items-center gap-2 text-lg text-stone-600 md:gap-4 md:text-xl xl:text-2xl"
            >
              <span
                class="rounded-md bg-stone-100 px-3 py-1 text-stone-700 shadow-sm dark:bg-stone-700 dark:text-stone-100"
              >
                {ingredient.cas || "Not available"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Usage Information -->
      <div class="bg-white p-6 shadow-sm md:rounded-lg dark:bg-stone-900">
        <Label>How to Use</Label>
        <p class="mt-2 min-h-24 text-lg md:min-h-36">
          {useMessage}
        </p>
      </div>

      <!-- Properties -->
      <div class="bg-white p-6 shadow-sm md:rounded-lg dark:bg-stone-900">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <Label>Volatility</Label>
            <p class="mt-2 text-lg">{volatility}</p>
          </div>
          <div>
            <Label>IFRA Status</Label>
            <p class="mt-2 text-lg">{ifraStatus}</p>
          </div>
          <div>
            <Label>Origin</Label>
            <p class="mt-2 text-lg">{origin}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column - Additional Info -->
    <div class="space-y-6 lg:col-span-1">
      <!-- Related Ingredients / PHOTO -->
      <div
        class="relative aspect-square overflow-hidden bg-white shadow-sm md:rounded-lg dark:bg-stone-900"
      >
        {#if unsplashData}
          <img
            alt={ingredient.commonName}
            src={unsplashData.urls.regular}
            class="h-full w-full object-cover"
          />
          <p
            class="bg-opacity-75 absolute right-2 bottom-2 rounded bg-stone-50 px-2 py-1 text-sm text-stone-900 italic"
          >
            Photo by <a {href} class="underline">{unsplashData.user.name}</a> on
            <a
              href="https://unsplash.com/?utm_source=bcf&utm_medium=referral"
              class="underline">Unsplash</a
            >
          </p>
        {/if}
      </div>

      <!-- Alternative Names -->
      <div class="bg-white p-6 shadow-sm md:rounded-lg dark:bg-stone-900">
        <Label>Also Known As</Label>
        <div class="mt-2">
          {#if otherNames !== "No alternative names"}
            {#each otherNames.split(";") as name}
              <span
                class="mr-2 mb-2 inline-block rounded-lg bg-stone-100 px-4 py-2 text-sm text-stone-700 dark:bg-stone-700 dark:text-stone-100"
              >
                {name.trim()}
              </span>
            {/each}
          {:else}
            <p class="text-stone-500 italic">{otherNames}</p>
          {/if}
        </div>
      </div>
    </div>
  </div>
  <form
    id="controls"
    class="mt-4 flex flex-row space-x-4 place-self-center md:place-self-end"
    method="POST"
    use:enhance={() => {
      isSubmitting = true;

      return async ({ result, update }) => {
        isSubmitting = false;
        if (result.type === "success") {
          notification.set({ message: "Added to Collection", type: "success" });
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
    <input type="hidden" value={ingredient.commonName} name="commonName" />
    <input type="hidden" value={ingredient.cas} name="cas" />
    <input type="hidden" value={ingredient.ingDescription} name="markdown" />
    <input type="hidden" value={ingredient.otherNames} name="otherNames" />
    <SubmitButton>Add to Collection</SubmitButton>
    <EditButton href="{ingredient.slug}/suggest">Suggest a Change</EditButton>
  </form>
</div>

<style>
  :global(.prose) {
    max-width: none;
  }
</style>
