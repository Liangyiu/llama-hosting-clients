<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	let {
		items
	}: {
		items: {
			title: string;
			url?: string;
			// This should be `Component` after lucide-svelte updates types
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			icon: any;
			type?: string;
			isActive?: boolean;
			items?: {
				title: string;
				url: string;
				isActive?: boolean;
			}[];
		}[];
	} = $props();
</script>

<Sidebar.Group>
	<Sidebar.Menu>
		{#each items as mainItem, index (mainItem.title)}
			{#if mainItem.type === 'collapsible'}
				<Collapsible.Root open={mainItem.isActive} class="group/collapsible">
					{#snippet child({ props })}
						<Sidebar.MenuItem {...props}>
							<Collapsible.Trigger>
								{#snippet child({ props })}
									<Sidebar.MenuButton {...props}>
										{#snippet tooltipContent()}
											{mainItem.title}
										{/snippet}
										{#if mainItem.icon}
											<mainItem.icon />
										{/if}
										<span>{mainItem.title}</span>
										<ChevronRight
											class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
										/>
									</Sidebar.MenuButton>
								{/snippet}
							</Collapsible.Trigger>
							<Collapsible.Content>
								{#if mainItem.items}
									<Sidebar.MenuSub>
										{#each mainItem.items as subItem (subItem.title)}
											<Sidebar.MenuSubItem>
												<Sidebar.MenuSubButton isActive={subItem.isActive}>
													{#snippet child({ props })}
														<a href={subItem.url} {...props}>
															<span>{subItem.title}</span>
														</a>
													{/snippet}
												</Sidebar.MenuSubButton>
											</Sidebar.MenuSubItem>
										{/each}
									</Sidebar.MenuSub>
								{/if}
							</Collapsible.Content>
						</Sidebar.MenuItem>
					{/snippet}
				</Collapsible.Root>
			{:else if mainItem.type === 'single'}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton isActive={mainItem.isActive}>
						{#snippet child({ props })}
							<a href={mainItem.url} {...props}>
								<mainItem.icon />
								<span>{mainItem.title}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/if}
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
