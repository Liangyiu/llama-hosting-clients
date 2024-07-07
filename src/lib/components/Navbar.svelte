<script lang="ts">
	import type { UsersRecord } from '$lib/types/pbTypes';
	import MobileSidebar from './MobileSidebar.svelte';
	import NavbarRoutes from './NavbarRoutes.svelte';
</script>

<div class="flex h-full items-center p-4 mx-auto max-w-[1450px]">
	<MobileSidebar />
	<NavbarRoutes />
</div>
