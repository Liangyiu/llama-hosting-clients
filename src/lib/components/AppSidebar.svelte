<script lang="ts">
	import BookOpen from 'lucide-svelte/icons/book-open';
	import Bot from 'lucide-svelte/icons/bot';
	import LifeBuoy from 'lucide-svelte/icons/life-buoy';
	import Send from 'lucide-svelte/icons/send';
	import Settings2 from 'lucide-svelte/icons/settings-2';
	import SquareTerminal from 'lucide-svelte/icons/square-terminal';
	import NavMain from '$lib/components/NavMain.svelte';
	import NavSecondary from '$lib/components/NavSecondary.svelte';
	import NavUser from '$lib/components/NavUser.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { type ComponentProps } from 'svelte';
	import { getUserState } from '$lib/stores/UserStore.svelte';
	import { page } from '$app/state';
	import Bell from 'lucide-svelte/icons/bell';

	let navRoutes = $derived({
		navMain: [
			{
				title: 'Dashboard',
				url: '/dashboard',
				icon: SquareTerminal,
				type: 'single',
				isActive: page.url.pathname === '/dashboard'
			},
			{
				title: 'Settings',
				icon: Settings2,
				type: 'collapsible',
				isActive: page.url.pathname.startsWith('/settings'),
				items: [
					{
						title: 'Account',
						url: '/settings/account',
						isActive: page.url.pathname === '/settings/account'
					},
					{
						title: 'Security',
						url: '/settings/security',
						isActive: page.url.pathname === '/settings/security'
					},
					{
						title: 'SSH Key Vault',
						url: '/settings/ssh-key-vault',
						isActive: page.url.pathname === '/settings/ssh-key-vault'
					}
				]
			}
		],
		navSecondary: [
			{
				title: 'Support',
				url: '/support',
				icon: LifeBuoy
			},
			{
				title: 'Notifications',
				url: '/notifications',
				icon: Bell
			}
		]
	});

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
		<NavMain items={navRoutes.navMain} />
		<NavSecondary items={navRoutes.navSecondary} class="mt-auto" />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser
			user={{ avatar: user.avatar, email: user.email, name: user.firstName + ' ' + user.lastName }}
		/>
	</Sidebar.Footer>
</Sidebar.Root>
