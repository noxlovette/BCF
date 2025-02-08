<script lang="ts">
  import type { IngredientCollection } from "$lib/types";
  import MetaData from "$lib/components/MetaData.svelte";
  import { EditButton, HeaderMerger } from "$lib/components";

  let { data } = $props();
  let ingredient: IngredientCollection = data.ingredient;

  function formatValue(
    value: string | null | undefined,
    defaultText = "Not available",
  ): string {
    return value?.trim() || defaultText;
  }

  const otherNames = formatValue(
    ingredient.otherNames,
    "No alternative names available",
  );
  const description = formatValue(
    ingredient.markdown,
    "No description available",
  );
  const casNumber = formatValue(ingredient.cas, "CAS number not available");
</script>

<MetaData
  title={`${formatValue(ingredient.commonName)} | Collect`}
  robots="noindex, nofollow"
/>

<HeaderMerger colour="wine">
  {formatValue(ingredient.commonName, "Unnamed Ingredient")}
</HeaderMerger>
<!-- Main Content Grid -->
<div class="grid w-full grid-cols-1 gap-8 lg:grid-cols-3">
  <!-- Left Column - Main Info -->
  <div class="lg:col-span-2">
    <!-- CAS and Amount Card -->
    <div class="mb-6 flex w-full space-x-6">
      <div
        class="flex flex-col bg-white p-6 shadow-sm md:w-1/3 md:rounded-lg dark:bg-stone-800"
      >
        <h2
          class="font-semibold text-stone-700 md:mb-3 md:text-xl dark:text-stone-500"
        >
          CAS Number
        </h2>
        <p class="font-mono text-lg">
          {casNumber}
        </p>
      </div>
      <div
        class="flex flex-1 flex-col bg-white p-6 shadow-sm md:rounded-lg dark:bg-stone-800"
      >
        <h2
          class="font-semibold text-stone-700 md:mb-3 md:text-xl dark:text-stone-500"
        >
          Ingredient Details
        </h2>

        <div class="flex items-center justify-between">
          <span class="text-stone-700 dark:text-stone-300">Available</span>
          <span class="font-semibold text-stone-900 dark:text-stone-100"
            >{ingredient.amount} {ingredient.unit}</span
          >
        </div>
      </div>
    </div>
    <!-- Description Card -->
    <div class="bg-white p-6 shadow-sm md:mb-6 md:rounded-lg dark:bg-stone-800">
      <h2
        class="font-semibold text-stone-700 md:mb-3 md:text-xl dark:text-stone-500"
      >
        Description
      </h2>
      <p class="">
        {description}
      </p>
    </div>
  </div>
  <!-- Right Column - Additional Info -->
  <div class="lg:col-span-1">
    <!-- Also Known As Card -->
    <div class="mb-6 bg-white p-6 shadow-sm md:rounded-lg dark:bg-stone-800">
      <h2
        class="font-semibold text-stone-700 md:mb-3 md:text-xl dark:text-stone-500"
      >
        Also Known As
      </h2>
      <div class="space-y-2">
        {#if otherNames !== "No alternative names available"}
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

<EditButton
  colour="wine"
  styling=" self-center md:self-end"
  href="{ingredient.id}/edit">Edit</EditButton
>
