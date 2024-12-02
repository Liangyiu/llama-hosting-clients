<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { activeSettingsSection } from '$lib/stores/stores.svelte';
	import { cn } from '$lib/utils';

	interface Props {
		label: string;
		href: string;
	}

	let { label, href }: Props = $props();
	let pathname = $derived($page.url.pathname);
	let isActive = $derived(pathname.includes(href));

	let settingsAccordion = $derived(browser ? document.getElementById('settings-accordion') : null);
</script>

<a
	onclick={() => {
		settingsAccordion?.click();

		activeSettingsSection.set(label);
	}}
	class={cn(
		'flex items-center transition-all hover:text-secondary-600-400 hover:bg-surface-hover',
		{
			'text-secondary-600-400 bg-surface-500/20 md:bg-surface-500/10': isActive
		}
	)}
	{href}
>
	<div class="flex items-center p-2.5 md:p-5">
		{label}
	</div>
</a>
