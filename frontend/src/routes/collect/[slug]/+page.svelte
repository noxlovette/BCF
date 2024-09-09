<script lang='ts'>
    import type { PageData } from './$types';

    export let data:PageData;

    const ingredient:App.IngredientCollection = data.ingredient;


</script>


<div>
    <h1>
        {ingredient.common_name}
    </h1>
    <p>
        {ingredient.use}
    </p>
    <p>
        {ingredient.impression}
        {ingredient.colour}
        {ingredient.associations}
    </p>
</div>