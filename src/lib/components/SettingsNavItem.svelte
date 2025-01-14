<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '$lib/utils';

	interface Props {
		label: string;
		href: string;
		itemClicked: (item: { label: string; href: string }) => void;
	}

	let { label, href, itemClicked }: Props = $props();
	let pathname = $derived(page.url.pathname);
	let isActive = $derived(pathname.includes(href));
</script>

<a
	onclick={() => itemClicked({ label, href })}
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
