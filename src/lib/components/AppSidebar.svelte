<script lang="ts">
	import LifeBuoy from 'lucide-svelte/icons/life-buoy';
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
	import { authClient } from '$lib/client/auth-client';
	import { getAvatarUri } from '$lib/utility/avatar';

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

	const session = authClient.useSession();
	let user = $state(getUserState());
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
			user={{
				avatar: user.avatar,
				email: $session?.data?.user.email || '',
				name: user.firstName + ' ' + user.lastName
			}}
		/>
	</Sidebar.Footer>
</Sidebar.Root>
