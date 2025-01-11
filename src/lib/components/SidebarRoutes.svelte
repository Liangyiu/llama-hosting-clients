<script lang="ts">
	import SidebarItem from './SidebarItem.svelte';
	import IconCloudComputing from '~icons/tabler/cloud-computing';
	import IconFileInvoice from '~icons/tabler/file-invoice';
	import IconTicket from '~icons/tabler/ticket';
	import IconHome from '~icons/tabler/home';
	import IconSettings from '~icons/tabler/settings';
	import IconShoppingCartCheck from '~icons/tabler/shopping-cart-check';
	import IconWorldWww from '~icons/tabler/world-www';

	const routes = [
		{
			icon: IconHome,
			label: 'Dashboard',
			href: '/dashboard',
			href2: 'filler'
		},
		{
			icon: IconCloudComputing,
			label: 'VPS',
			href: '/vps/list',
			href2: 'filler'
		},
		{
			icon: IconWorldWww,
			label: 'Webhosting',
			href: '/webhosting/list',
			href2: 'filler'
		},
		{
			icon: IconShoppingCartCheck,
			label: 'Orders',
			href: '/orders',
			href2: 'filler'
		},
		{
			icon: IconFileInvoice,
			label: 'Invoices',
			href: '/invoices',
			href2: 'filler'
		},
		{
			icon: IconTicket,
			label: 'Tickets',
			href: '/tickets',
			href2: 'filler'
		},
		{
			icon: IconSettings,
			label: 'Settings',
			href: '/settings/account',
			href2: '/settings'
		}
	];
</script>

<div class="flex w-full flex-col">
	{#each routes as { href, href2, icon, label }}
		<SidebarItem {href} {href2} {icon} {label} />
	{/each}
</div>
