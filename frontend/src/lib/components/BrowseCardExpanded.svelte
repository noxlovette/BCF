<script lang="ts">
    export let ingredient: any = {};
    </script>

<div id="card-big" class="p-8 rounded-lg shadow-md bg-white min-h-[400px] min-w-[600px] transition-all border-sky-950">
    <div id="top-part" class="flex flex-row items-baseline border-b">
        <div id="top-left" class="flex flex-col items-start border-r w-2/3 pr-4 py-2">
            <h1 class="text-4xl tracking-tighter font-bold truncate text-sky-800 mr-8">{ingredient.common_name}</h1>
            <h2 class="text-sm opacity-60 ">{ingredient.descriptors}</h2>
        </div>
        <div id="top-right" class="flex flex-1 flex-col items-start pl-4 py-2">
            <h2 class="text-2xl opacity-60 min-w-fit ">{ingredient.cas}</h2>
            {#if ingredient.volalitliy}
            <h2 class="text-sm opacity-60 ">{ingredient.volatility}</h2>
            {:else}
            <h2 class="text-sm opacity-60 ">volatile</h2>
            {/if}
        </div>
    </div>
    <div id="bottom-part" class="flex flex-row">

    <div id="bottom-left" class="flex flex-col border-r w-2/3">
    <p class="text-clip mr-8 my-4">
        {#if ingredient.use}  
        {ingredient.use}
        {:else}
        know how to use this? Submit a suggestion!
        {/if}
    </p>
<div class="flex flex-col items-start mt-[200px]">
    <h3 class="text-sm opacity-60">
        similar ingredients
    </h3>
    <p class="">
        {#if ingredient.similar_ingredients !== "" && ingredient.similar_ingredients !== "none"}
        {ingredient.similar_ingredients}
        {:else}
        none
        {/if}
    </p>
</div>
</div>

<div id="bottom-right" class="flex flex-1 p-4">
    <ul class="space-y-8">
        <li class="flex flex-col items-start">
            <h3 class="text-sm opacity-60">
                origin
            </h3>
    <p>
        {ingredient.origin}
    </p>

</li>
<li class="flex flex-col items-start">
    <h3 class="text-sm opacity-60">
        IFRA
    </h3>

    <p>
        {ingredient.is_restricted}
    </p>
</li>
<li class="flex flex-col items-start">
    <h3 class="text-sm opacity-60">
        contributors
    </h3>

    <p>
        {ingredient.contributors}
    </p>
</li>
    </ul>
</div>  
</div>


</div>