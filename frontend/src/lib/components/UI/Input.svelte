<script lang="ts">
	export let label = '';
	export let name = '';
	export let value = '';
</script>

<div class="w-full flex flex-col">
<label

	class="block text-left text-gold-700/80 dark:text-gold-200/80"
	for={label.toLowerCase().replace(/\s+/g, '-')}>
	{label}
</label>

<input
	id={label.toLowerCase().replace(/\s+/g, '-')}
	name={name.toLowerCase().replace(/\s+/g, '-')}
	class="
    rounded border  focus:border-gold-400  border-gold-400 dark:border-gold-900 focus:ring-2 focus:ring-gold-400/70 shadow-sm  dark:bg-stone-800 dark:focus:border-gold-400 dark:focus:ring-gold-400/70
		{$$props.class}"
	bind:value
/>

</div>