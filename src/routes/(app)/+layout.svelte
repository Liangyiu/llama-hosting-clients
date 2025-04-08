<script lang="ts">
	import { page } from '$app/state';
	import { authClient } from '$lib/client/auth-client.js';
	import AppSidebar from '$lib/components/AppSidebar.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { setUserState } from '$lib/stores/UserStore.svelte.js';
	import { getAvatarUri } from '$lib/utility/avatar.js';

	const { children, data } = $props();

	let crumbs = $derived(page.data.extra?.crumbs);

	const session = authClient.useSession();

	let user = $session.data?.user;
	const firstName = data.userDetails?.first_name ? data.userDetails?.first_name : 'New';
	const lastName = data.userDetails?.last_name ? data.userDetails?.last_name : 'User';

	setUserState({
		firstName,
		lastName,
		email: $session.data?.user.email,
		avatar: getAvatarUri(firstName, lastName)
	});
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
		<div class="px-4 md:p-6">
			<div class="mx-auto h-full min-h-full max-w-[1450px] md:h-full">
				{@render children?.()}
			</div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
