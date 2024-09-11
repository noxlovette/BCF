<script lang="ts">
    import { enhance } from "$app/forms";
    import {notification} from "$lib/stores";
        import Input from "./UI/Input.svelte";
        import Textarea from "./UI/Textarea.svelte";
    
    export let ingredient: App.IngredientCollection;

    export let editing:boolean;
    
    </script>
    <form class="my-6 space-y-8" method="POST" action="?/update" use:enhance= {()=> notification.set({message:"Ingredient sent", type:"success"})}
    >
    <div class="flex flex-row justify-between items-baseline">
    <h1 class="text-5xl border-b-2 border-grapefruit-600">
      Editing {ingredient.common_name}
    </h1>
    <button
          type=submit
      class="text-center w-[100px] rounded-lg bg-gold-400 border-gold-700 dark:border-gold-900 p-2 text-stone-900 shadow transition-all hover:bg-stone-50 hover:text-gold-400 dark:hover:bg-stone-700"
      >
    Submit
        </button>

        <button on:click|preventDefault={() => editing = false}
      class="text-center w-[100px] rounded-lg bg-gold-400 border-gold-700 dark:border-gold-900 p-2 text-stone-900 shadow transition-all hover:bg-stone-50 hover:text-gold-400 dark:hover:bg-stone-700"
      >
    Cancel
        </button>
<form method="POST" action="?/delete" use:enhance={()=> notification.set({message: `Deleted ${ingredient.common_name}`, type:"success"})}>
  <input type="hidden" name="id" value="{ingredient.id}" />
  <button
  type=submit
class="text-center w-[100px] rounded-lg bg-peach-400 border-peach-700 dark:border-peach-900 p-2 text-stone-900 shadow transition-all hover:bg-stone-50 hover:text-peach-400 dark:hover:bg-stone-700"
>
Delete
</button>
</form>

      </div>
    <div  class="grid grid-cols-3 gap-4 items-center">
          <Input type="text" name="common_name" value="{ingredient.common_name}" label="Common Name" />
          <Input type="text" name="cas" value="{ingredient.cas}" label="CAS Number" />
          <Input type="text" name="other_names" value="{ingredient.other_names}" label="Other Names" />
          <Input type="text" name="volatility" value="{ingredient.volatility}" label="Volatility" />
          <Input type="text" name="origin" value="{ingredient.origin}" label="Origin" />
          <Input type="text" name="is_restricted" value="{ingredient.is_restricted}" label="IFRA Status" />
          <Input type="text" name="colour" value="{ingredient.colour}" label="Colour" />
          <Input type="text" name="ideas" value="{ingredient.ideas}" label="Ideas" />
          <block></block>
          <Textarea name="use" value="{ingredient.use}" label="Use" class=" h-full" />
          <Textarea name="associations" value="{ingredient.associations}" label="Associations" class=" h-full" />
          <Textarea name="impression" value="{ingredient.impression}" label="Impression" class=" h-full" />
          <div class="col-span-3 flex justify-center ">
          <input type="hidden" name="id" value="{ingredient.id}" />
          <input type="hidden" name="descriptors" value="{ingredient.descriptors}" />
        
        </div>
      </div>
    </form>