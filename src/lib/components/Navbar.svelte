<script lang="ts">
	import type { UsersRecord } from '$lib/types/pbTypes';
	import MobileSidebar from './MobileSidebar.svelte';
	import NavbarRoutes from './NavbarRoutes.svelte';

	export let user: UsersRecord | null;
</script>

<div class="flex h-full items-center p-4 mx-auto max-w-[1450px]">
	<MobileSidebar />
	<NavbarRoutes {user} />
</div>
