<script lang="ts">
	import type { UsersRecord } from '$lib/types/pbTypes';
	import Navbar from './Navbar.svelte';

	export let user: UsersRecord | null;
</script>

<div class="fixed inset-y-0 z-50 h-[80px] w-full md:pl-56">
	<Navbar {user} />
</div>
<div class="fixed inset-y-0 z-50 hidden h-full w-56 flex-col md:flex">
	<!-- <SideBar /> -->
</div>
