<script lang="ts">
	import { page } from '$app/stores';
	import { createSidebarStore } from '$lib/stores/SideBarStore.svelte';
	import { cn } from '$lib/utils';
	import type { Component } from 'svelte';

	interface Props {
		label: string;
		icon: Component;
		href: string;
		href2: string;
	}

	let { label, icon, href, href2 }: Props = $props();
	let isActive = $derived($page.url.pathname.includes(href) || $page.url.pathname.includes(href2));

	const SvelteComponent = $derived(icon);
</script>

<a
	{href}
	class={cn(
		'flex items-center gap-x-2 text-sm font-medium transition-all hover:text-secondary-600-400',
		{
			'text-secondary-600-400': isActive
		}
	)}
>
	<div class="flex items-center gap-x-2 py-4">
		<SvelteComponent
			class={cn('text-muted-foreground', {
				'text-primary': isActive
			})}
			size="22"
		/>
		{label}
	</div>
</a>
