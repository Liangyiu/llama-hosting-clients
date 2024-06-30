<script lang="ts">
	import { goto } from '$app/navigation';
	import type { UsersRecord } from '$lib/types/pbTypes';
	import { Avatar, LightSwitch, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { LogOutIcon, SettingsIcon } from 'lucide-svelte';
	import ThemeSelector from './ThemeSelector.svelte';

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
		await fetch('/clients/dashboard/?/logout', {
			method: 'post',
			body: new FormData()
		});
		return await goto('/clients/login?logout=1');
	}

	const dropdownItemClasses =
		'w-full py-2 px-3 text-left hover:bg-surface-600/75 transition-colors';
</script>

<!-- routes -->
<div class="ml-auto flex gap-x-4 items-center">
	<LightSwitch />
	<ThemeSelector />
	<button use:popup={avatarClick}>
		<Avatar
			src={`https://api.dicebear.com/9.x/initials/svg?backgroundType=gradientLinear&backgroundColor=b347fd,6553a8&backgroundRotation=240,360&textColor=ededed&seed=` +
				initials}
			rounded="rounded-full"
			width="w-12"
			border="border-4 border-surface-300-600-token hover:!border-surface-500-400-token transition-colors"
		/>
		<span class="sr-only">Toggle user menu</span>
	</button>
</div>

<!-- card -->
<div class="card variant-glass-tertiary w-36" data-popup="avatarClick">
	<div
		class="w-full [&>*:first-child]:rounded-t-[var(--theme-rounded-container)] [&>*:last-child]:rounded-b-[var(--theme-rounded-container)]"
	>
		<button class={dropdownItemClasses} on:click={() => goto('/clients/settings')}>
			<div class="flex items-center space-x-2">
				<SettingsIcon size="18" /> <span>Settings</span>
			</div>
		</button>
		<hr class="!border-surface-800-100-token" />
		<button class={dropdownItemClasses} on:click={logout}>
			<div class="flex items-center space-x-2">
				<LogOutIcon size="18" /> <span>Logout</span>
			</div>
		</button>
	</div>
</div>
