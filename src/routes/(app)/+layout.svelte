<script lang="ts">
	import { page } from '$app/state';
	import AppSidebar from '$lib/components/AppSidebar.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { setUserState } from '$lib/stores/UserStore.svelte.js';

	const { children, data } = $props();
	const { user, avatar } = data;

	setUserState({
		avatar,
		email: user?.email || '',
		firstName: user?.first_name || '',
		lastName: user?.last_name || '',
		mfaTotp: user?.mfa_totp || false,
		user: user?.id || ''
	});

	let crumbs = $derived(page.data.extra?.crumbs);
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header class="flex h-16 shrink-0 items-center gap-2">
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Breadcrumbs {crumbs} />
			</div>
		</header>
		<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
			{@render children()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
