<script lang="ts">
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	// Icons
	import IconMoon from 'lucide-svelte/icons/moon';
	import IconSun from 'lucide-svelte/icons/sun';

	import { setMode, systemPrefersMode, userPrefersMode } from 'mode-watcher';

	let darkMode = $state(
		$userPrefersMode === 'system'
			? $systemPrefersMode === undefined
				? false
				: $systemPrefersMode !== 'dark'
			: $userPrefersMode !== 'dark'
	);

	// Handle the change in state when toggled.
	function handleModeChange() {
		if (darkMode) {
			setMode('dark');
		} else {
			setMode('light');
		}
	}
</script>

<Switch
	name="mode"
	bind:checked={darkMode}
	controlActive="bg-surface-200"
	onCheckedChange={handleModeChange}
>
	{#snippet inactiveChild()}<IconMoon size="14" />{/snippet}
	{#snippet activeChild()}<IconSun size="14" />{/snippet}
	<span class="sr-only">Toggle theme</span>
</Switch>
