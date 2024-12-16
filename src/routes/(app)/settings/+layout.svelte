<script lang="ts">
	import SettingsNav from '$lib/components/SettingsNav.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="w-full md:grid md:grid-cols-4 preset-glass-surface rounded-lg">
	<div class="flex md:col-span-1 md:border-r-2 md:border-surface-300-700">
		<SettingsNav />
	</div>
	<div class="md:col-span-3 md:py-4 px-3 flex md:pt-4 pl-4">
		{@render children?.()}
	</div>
</div>
