<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';

	interface Props {
		crumbs?: Array<{
			title: string;
			url?: string;
		}>;
	}

	let { crumbs }: Props = $props();
</script>

{#if crumbs}
	<Separator orientation="vertical" class="mr-2 h-4" />
	<Breadcrumb.Root>
		<Breadcrumb.List>
			{#each crumbs as crumb, pos (crumb.title)}
				{#if crumbs.length === pos + 1}
					<Breadcrumb.Item>
						<Breadcrumb.Page>{crumb.title}</Breadcrumb.Page>
					</Breadcrumb.Item>
				{:else if !crumb.url}
					<Breadcrumb.Item>
						<Breadcrumb.Page class="hidden md:block">{crumb.title}</Breadcrumb.Page>
					</Breadcrumb.Item>
					{#if !crumb.url}
						<Breadcrumb.Separator class="hidden md:block" />
					{/if}
				{:else}
					<Breadcrumb.Item class="hidden md:block">
						<Breadcrumb.Link href={crumb.url}>{crumb.title}</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator class="hidden md:block" />
				{/if}
			{/each}
		</Breadcrumb.List>
	</Breadcrumb.Root>
{/if}
