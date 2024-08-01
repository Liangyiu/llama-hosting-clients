<script lang="ts">
	import SettingsNav from '$lib/components/SettingsNav.svelte';
</script>

<div class="w-full md:grid md:grid-cols-4 variant-glass-surface rounded-lg">
	<div class="flex md:col-span-1 md:border-r-2 md:border-surface-300-600-token">
		<SettingsNav />
	</div>
	<div class="md:col-span-3 md:py-4 px-3 flex md:bg-surface-500/10 md:pt-4 pl-4">
		<slot />
	</div>
</div>
