<script lang="ts">
  import { enhance } from "$app/forms";
  import { notification } from "$lib/stores";
  import Input from "./UI/Input.svelte";
  import Textarea from "./UI/Textarea.svelte";

  export let ingredient: App.IngredientBrowse;

  let suggestion = {
    common_name: ingredient.common_name,
    volatility: ingredient.volatility,
    use: ingredient.use,
    similar_ingredients: ingredient.similar_ingredients,
    origin: ingredient.origin,
    other_names: ingredient.other_names,
    is_restricted: ingredient.is_restricted,
  };
</script>

<form
  method="POST"
  action="?/suggest"
  use:enhance={() =>
    notification.set({ message: "suggestion sent", type: "success" })}
  class="grid grid-cols-2 items-center"
>
  <div class="space-y-2 p-4">
    <Input
      type="text"
      name="common_name"
      value={suggestion.common_name}
      label="Common Name"
    />
    <Input
      type="text"
      name="other_names"
      value={suggestion.other_names}
      label="Other Names"
    />
    <Input
      type="text"
      name="volatility"
      value={suggestion.volatility}
      label="Volatility"
    />
  </div>
  <Textarea name="use" value={suggestion.use} label="Use" class="h-full p-4" />
  <div class="space-y-2 p-4">
    <Input
      type="text"
      name="similar_ingredients"
      value={suggestion.similar_ingredients.toString()}
      label="Similar Ingredients"
    />
    <Input type="text" name="origin" value={suggestion.origin} label="Origin" />
    <Input
      type="text"
      name="is_restricted"
      value={suggestion.is_restricted}
      label="IFRA Status"
    />
    <input type="hidden" name="ingredient" value={ingredient.id} />
  </div>
  <div class="col-span-2 flex justify-center p-4">
    <button
      type="submit"
      class="w-[100px] rounded border-gold-700 bg-gold-400 p-2 text-center text-stone-900 shadow transition-all hover:bg-stone-50 hover:text-gold-400 dark:border-gold-900 dark:hover:bg-stone-700"
    >
      Submit
    </button>
  </div>
</form>
