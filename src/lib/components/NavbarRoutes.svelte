<script lang="ts">
	import { goto } from '$app/navigation';
	import type { UsersRecord } from '$lib/types/pbTypes';
	import { Avatar, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import ThemeSelector from './ThemeSelector.svelte';
	import Wallet from '@tabler/icons-svelte/icons/wallet';
	import { getUserState } from '$lib/stores/userStore';

	const user = getUserState();

	const avatarClick: PopupSettings = {
		event: 'click',
		target: 'avatarClick',
		placement: 'bottom'
	};

	let initials =
		$derived(($user.firstName.charAt(0).toUpperCase() || 'L') +
		($user.lastName.charAt(0).toUpperCase() || 'L'));

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
				src={$user.avatarUrl === ''
					? `https://api.dicebear.com/9.x/initials/svg?backgroundType=gradientLinear&backgroundColor=b347fd,6553a8&backgroundRotation=240,360&textColor=ededed&seed=` +
						initials
					: `${$user.avatarUrl}?thumb=200x200`}
				rounded="rounded-full"
				width="w-12"
				border="border-2 border-surface-300-600-token hover:!border-surface-500-400-token transition-colors"
			/>
			<span class="sr-only">Toggle user menu</span>
		</button>
	</div>
</div>

<!-- card -->
<div class="card variant-glass-surface shadow-xl" data-popup="avatarClick">
	<div
		class="w-full [&>*:first-child]:rounded-t-[var(--theme-rounded-container)] [&>*:last-child]:rounded-b-[var(--theme-rounded-container)] px-3 py-2"
	>
		<div class="w-full px-3 text-left transition-colors py-2">
			<span class="block text font-semibold">{$user.firstName} {$user.lastName}</span>
			<span class="block text-sm align-middle"
				><Wallet size="16" class="inline mr-0.5" /> {$user.balance || 0} €</span
			>
		</div>
		<hr class="my-2" />

		{#each links as { href, text }}
			<button
				class="hover:bg-surface-600/75 w-full text-left transition-colors"
				onclick={() => goto(href)}
			>
				<div class="flex items-center space-x-2 px-3 py-2">
					<span>
						{text}
					</span>
				</div>
			</button>
		{/each}

		<hr class="my-2" />
		<button
			class="hover:bg-surface-600/75 w-full px-3 text-left transition-colors py-2"
			onclick={logout}
		>
			<div class="flex items-center space-x-2">
				<span>Logout</span>
			</div>
		</button>
	</div>
</div>
