<script lang="ts">
	import { goto } from '$app/navigation';
	import Wallet from '~icons/tabler/wallet';
	import { getUserState } from '$lib/stores/UserStore.svelte';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import { Popover } from '@skeletonlabs/skeleton-svelte';
	import LightSwitch from './LightSwitch.svelte';

	const user = getUserState();

	let popoverState = $state(false);

	let fullName = $derived(user.firstName + ' ' + user.lastName);

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
		<LightSwitch />

		<Popover
			bind:open={popoverState}
			positioning={{ placement: 'bottom', offset: { mainAxis: 15, crossAxis: 0 } }}
			contentBase="card preset-glass-surface shadow-xl bg-surface-200-800 p-4 space-y-4 max-w-[320px]"
		>
			{#snippet trigger()}
				<Avatar
					name={fullName}
					src={user.avatar}
					rounded="rounded-full"
					size="w-12 h-12"
					border="border-2 border-surface-300-700 hover:!border-surface-600-400 transition-colors"
				/>
				<span class="sr-only">Toggle user menu</span>
			{/snippet}
			{#snippet content()}
				<div
					class="w-full [&>*:first-child]:rounded-t-[var(--theme-rounded-container)] [&>*:last-child]:rounded-b-[var(--theme-rounded-container)] px-3 py-2"
				>
					<div class="w-full px-3 text-left transition-colors py-2">
						<span class="block text font-semibold">{user.firstName} {user.lastName}</span>
						<span class="block text-sm align-middle"
							><Wallet class="inline mr-0.5 size-[16px]" /> {user.balance || 0} €</span
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
			{/snippet}
		</Popover>
	</div>
</div>
