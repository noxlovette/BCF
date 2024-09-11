<script lang="ts">
    import Label from "$lib/components/UI/Label.svelte";
    import VariableInput from "./VariableInput.svelte";
    import VariableNumericInput from "./VariableNumericInput.svelte";
    export let ingredient:App.FormulaIngredient;
    export let i:number;

</script>

<div class="flex flex-row justify-between">

    <div id="left-part" class="flex flex-col tracking-tight">
        <Label>
            {ingredient.volatility}
        </Label>
        <VariableInput text={ingredient.common_name} />
    </div>

    <div id="right-part" class="grid grid-cols-2 text-right w-36">
        <VariableNumericInput number={ingredient.amount} class="flex-shrink-0 mt-auto" />
        <VariableNumericInput number={ingredient.percentage} text="%" class="opacity-60 flex-shrink-0 mt-auto" />
    </div>
    
</div>
