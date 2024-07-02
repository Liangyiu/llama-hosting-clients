<script lang="ts">
	import { goto } from '$app/navigation';
	import type { UsersRecord } from '$lib/types/pbTypes';
	import { Avatar, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import ThemeSelector from './ThemeSelector.svelte';
	import Wallet from '@tabler/icons-svelte/icons/wallet';

	const avatarClick: PopupSettings = {
		event: 'click',
		target: 'avatarClick',
		placement: 'bottom'
	};

	export let user: UsersRecord | null;
	let initials;
	if (user)
		initials = user?.first_name.charAt(0).toUpperCase() + user?.last_name.charAt(0).toUpperCase();
	else initials = 'LL';

	async function logout() {
		await fetch('/dashboard/?/logout', {
			method: 'post',
			body: new FormData()
		});
		return await goto('/login?logout=1');
	}

	const links = [
		{
			text: 'Accounting',
			href: '/accounting'
		},
		{
			text: 'Settings',
			href: '/settings/account'
		}
	];
</script>

<!-- routes -->
<div class="flex w-full items-center justify-between">
	<div class="w-fit hidden sm:block">
		<h1 class="h6">llama hosting - Control Panel</h1>
	</div>
	<div class="flex gap-x-4 items-center ml-auto">
		<ThemeSelector />
		<button use:popup={avatarClick}>
			<Avatar
				src={`https://api.dicebear.com/9.x/initials/svg?backgroundType=gradientLinear&backgroundColor=b347fd,6553a8&backgroundRotation=240,360&textColor=ededed&seed=` +
					initials}
				rounded="rounded-full"
				width="w-12"
				border="border-2 border-surface-300-600-token hover:!border-surface-500-400-token transition-colors"
			/>
			<span class="sr-only">Toggle user menu</span>
		</button>
	</div>
</div>

<!-- card -->
<div class="card variant-glass-tertiary shadow-xl" data-popup="avatarClick">
	<div
		class="w-full [&>*:first-child]:rounded-t-[var(--theme-rounded-container)] [&>*:last-child]:rounded-b-[var(--theme-rounded-container)]"
	>
		<div class="w-full px-3 text-left transition-colors py-2">
			<span class="block text font-semibold">{user?.first_name} {user?.last_name}</span>
			<span class="block text-sm align-middle"
				><Wallet size="16" class="inline mr-0.5" /> {user?.balance || 0} €</span
			>
		</div>
		<hr class="!border-surface-800-100-token" />
		<div>
			{#each links as { href, text }}
				<button
					class="hover:bg-surface-600/75 text-sm w-full px-3 py-2 text-left transition-colors"
					on:click={() => goto(href)}
				>
					<div class="flex items-center space-x-2">
						<span>
							{text}
						</span>
					</div>
				</button>
			{/each}
		</div>
		<hr class="!border-surface-800-100-token" />
		<button
			class="hover:bg-surface-600/75 text-sm w-full px-3 text-left transition-colors py-2"
			on:click={logout}
		>
			<div class="flex items-center space-x-2">
				<span>Logout</span>
			</div>
		</button>
	</div>
</div>
