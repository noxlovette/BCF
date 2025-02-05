<script lang="ts">
  let { multiplier = $bindable(1), ingredient } = $props();
</script>

<div class="flex flex-row justify-between">
  <div class="flex flex-col">
    <span class="text-sm text-gray-600 capitalize">
      {ingredient.volatility}
    </span>
    <p class="hover:text-aqua-700 text-lg transition-colors">
      {ingredient.name}
    </p>
  </div>
  <div class="flex space-x-6 text-right">
    <div class="flex flex-col">
      <span class="text-sm text-gray-600">Amount</span>
      <span class="text-lg font-medium">
        {(ingredient.amount * multiplier).toFixed(2)}g
      </span>
    </div>
    <div class="flex flex-col">
      <span class="text-sm text-gray-600">Percentage</span>
      <span class="text-lg text-gray-600">
        {ingredient.percentage.toFixed(2)}%
      </span>
    </div>
  </div>
</div>
