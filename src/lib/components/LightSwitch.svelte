<script lang="ts">
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	// Icons
	import IconMoon from '~icons/lucide/moon';
	import IconSun from '~icons/lucide/sun';

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
	{#snippet inactiveChild()}<IconMoon class="size-3.5" />{/snippet}
	{#snippet activeChild()}<IconSun class="size-3.5" />{/snippet}
	<span class="sr-only">Toggle theme</span>
</Switch>
