<script lang="ts">
  let { multiplier = 1, ingredient } = $props();
</script>

<div class="flex flex-row justify-between">
  <div id="left-part" class="flex flex-col tracking-tight">
    <p>ingredient.volatility</p>
    <p>ingredient.commonName</p>
  </div>

  <div id="right-part" class="grid w-36 grid-cols-2 text-right">
    <p>
      {ingredient.amount * multiplier}
    </p>

    <p>
      {ingredient.percentage}
    </p>
  </div>
</div>
