<script lang="ts">
	import type { UsersRecord } from '$lib/types/pbTypes';
	import Navbar from './Navbar.svelte';
	import Sidebar from './Sidebar.svelte';

	export let user: UsersRecord | null;
</script>

<div class="fixed inset-y-0 z-30 h-[80px] w-full md:pl-56">
	<Navbar {user} />
</div>
<div class="fixed inset-y-0 z-30 hidden h-full w-56 flex-col md:flex">
	<Sidebar />
</div>
