<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { activeSettingsSection } from '$lib/stores/stores';
	import { cn } from '$lib/utils';

	export let label: string;
	export let href: string;
	$: pathname = $page.url.pathname;
	$: isActive = pathname.includes(href);

	$: settingsAccordion = browser ? document.getElementById('settings-accordion') : null;
</script>

<a
	on:click={() => {
		settingsAccordion?.click();

		activeSettingsSection.set(label);
	}}
	class={cn(
		'flex items-center transition-all hover:text-secondary-500-400-token hover:bg-surface-hover-token',
		{
			'text-secondary-500-400-token bg-surface-500/20 md:bg-surface-500/10': isActive
		}
	)}
	{href}
>
	<div class="flex items-center p-2.5 md:p-5">
		{label}
	</div>
</a>
