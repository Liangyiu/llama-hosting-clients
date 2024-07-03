<script lang="ts">
	import SettingsNav from '$lib/components/SettingsNav.svelte';
</script>

<div class="flex items-center w-full h-fit"></div>
<div class="w-full md:grid gap-4 md:grid-cols-4 md:gap-4 variant-glass-surface rounded-lg">
	<div class="flex md:col-span-1 md:border-r-2 md:border-surface-300-600-token">
		<SettingsNav />
	</div>
	<div class="md:col-span-3 md:py-4 px-3 flex">
		<slot />
	</div>
</div>
