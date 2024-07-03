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

<button
	on:click={() => {
		settingsAccordion?.click();
		goto(href);
		activeSettingsSection.set(label);
	}}
	class={cn(
		'flex items-center transition-all hover:text-secondary-500-400-token hover:bg-surface-hover-token',
		{
			'text-secondary-500-400-token': isActive
		}
	)}
>
	<div class="flex items-center p-5">
		{label}
	</div>
</button>
