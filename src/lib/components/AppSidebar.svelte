<script lang="ts" module>
	import BookOpen from 'lucide-svelte/icons/book-open';
	import Bot from 'lucide-svelte/icons/bot';
	import LifeBuoy from 'lucide-svelte/icons/life-buoy';
	import Send from 'lucide-svelte/icons/send';
	import Settings2 from 'lucide-svelte/icons/settings-2';
	import SquareTerminal from 'lucide-svelte/icons/square-terminal';

	const data = {
		navMain: [
			{
				title: 'Dashboard',
				url: '/dashboard',
				icon: SquareTerminal,
				type: 'single'
			},
			{
				title: 'Playground',
				icon: SquareTerminal,
				type: 'collapsible',
				items: [
					{
						title: 'History',
						url: '#'
					},
					{
						title: 'Starred',
						url: '#'
					},
					{
						title: 'Settings',
						url: '#'
					}
				]
			},
			{
				title: 'Models',
				icon: Bot,
				type: 'collapsible',
				items: [
					{
						title: 'Genesis',
						url: '#'
					},
					{
						title: 'Explorer',
						url: '#'
					},
					{
						title: 'Quantum',
						url: '#'
					}
				]
			},
			{
				title: 'Documentation',
				icon: BookOpen,
				type: 'collapsible',
				items: [
					{
						title: 'Introduction',
						url: '#'
					},
					{
						title: 'Get Started',
						url: '#'
					},
					{
						title: 'Tutorials',
						url: '#'
					},
					{
						title: 'Changelog',
						url: '#'
					}
				]
			},
			{
				title: 'Settings',
				icon: Settings2,
				type: 'collapsible',
				items: [
					{
						title: 'Account',
						url: '/settings/account'
					},
					{
						title: 'Security',
						url: '/settings/security'
					},
					{
						title: 'SSH Key Vault',
						url: '/settings/ssh-key-vault'
					}
				]
			}
		],
		navSecondary: [
			{
				title: 'Support',
				url: '#',
				icon: LifeBuoy
			},
			{
				title: 'Feedback',
				url: '#',
				icon: Send
			}
		]
	};
</script>

<script lang="ts">
	import NavMain from '$lib/components/NavMain.svelte';
	import NavProjects from '$lib/components/NavProjects.svelte';
	import NavSecondary from '$lib/components/NavSecondary.svelte';
	import NavUser from '$lib/components/NavUser.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { type ComponentProps } from 'svelte';
	import { getUserState } from '$lib/stores/UserStore.svelte';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();

	let user = getUserState();
</script>

<Sidebar.Root bind:ref variant="inset" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg">
					{#snippet child({ props })}
						<a href="/dashboard" {...props}>
							<img
								class="hidden dark:block"
								src="/assets/logos/llama-hosting-logo-light-text.svg"
								alt="llama-hosting-logo"
							/>
							<img
								class="blok dark:hidden"
								src="/assets/logos/llama-hosting-logo-dark-text.svg"
								alt="llama-hosting-logo"
							/>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
		<NavSecondary items={data.navSecondary} class="mt-auto" />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser
			user={{ avatar: user.avatar, email: user.email, name: user.firstName + ' ' + user.lastName }}
		/>
	</Sidebar.Footer>
</Sidebar.Root>
