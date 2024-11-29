<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { type Icon } from '@tabler/icons-svelte';
	import type { ComponentType } from 'svelte';
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	const drawerStore = getDrawerStore();

	interface Props {
		label: string;
		icon: ComponentType<Icon>;
		href: string;
		href2: string;
	}

	let {
		label,
		icon,
		href,
		href2
	}: Props = $props();
	let isActive = $derived($page.url.pathname.includes(href) || $page.url.pathname.includes(href2));

	const SvelteComponent = $derived(icon);
</script>

<a
	{href}
	class={cn(
		'flex items-center gap-x-2 text-sm font-medium transition-all hover:text-secondary-500-400-token',
		{
			'text-secondary-500-400-token': isActive
		}
	)}
	onclick={() => drawerStore.close()}
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
