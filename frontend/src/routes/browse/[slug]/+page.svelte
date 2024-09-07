<script lang='ts'>
    import type { PageData } from './$types';

    export let data:PageData;

    const ingredient:App.IngredientBrowse = data.ingredient;

</script>


<div>
    <h1>
        {ingredient.common_name}
    </h1>
    <p>
        {ingredient.use}
    </p>
</div>