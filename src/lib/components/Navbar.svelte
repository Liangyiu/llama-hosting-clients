<script lang="ts">
	import type { UsersRecord } from '$lib/types/pbTypes';
	import NavbarRoutes from './NavbarRoutes.svelte';

	export let user: UsersRecord | null;
</script>

<div class="flex h-full items-center border-b bg-background p-4 shadow-sm">
	<!-- <MobileSidebar /> -->
	<NavbarRoutes {user} />
</div>
