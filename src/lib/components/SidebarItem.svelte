<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { type Icon } from '@tabler/icons-svelte';
	import type { ComponentType } from 'svelte';
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	const drawerStore = getDrawerStore();

	export let label: string;
	export let icon: ComponentType<Icon>;
	export let href: string;
	export let href2: string;
	$: isActive = $page.url.pathname.includes(href) || $page.url.pathname.includes(href2);
</script>

<a
	{href}
	class={cn(
		'flex items-center gap-x-2 text-sm font-medium transition-all hover:text-secondary-500-400-token',
		{
			'text-secondary-500-400-token': isActive
		}
	)}
	on:click={() => drawerStore.close()}
>
	<div class="flex items-center gap-x-2 py-4">
		<svelte:component
			this={icon}
			class={cn('text-muted-foreground', {
				'text-primary': isActive
			})}
			size="22"
		/>
		{label}
	</div>
</a>
