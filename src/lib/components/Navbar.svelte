<script lang="ts">
	import type { UsersRecord } from '$lib/types/pbTypes';
	import MobileSidebar from './MobileSidebar.svelte';
	import NavbarRoutes from './NavbarRoutes.svelte';

	export let user: UsersRecord | null;
</script>

<div
	class="flex h-full items-center border-b-2 border-surface-300-600-token variant-glass-surface p-4 shadow-sm"
>
	<MobileSidebar />
	<NavbarRoutes {user} />
</div>
