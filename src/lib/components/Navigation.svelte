<script lang="ts">
	import type { UsersRecord } from '$lib/types/pbTypes';
	import Navbar from './Navbar.svelte';
	import Sidebar from './Sidebar.svelte';

	export let user: UsersRecord | null;
	export let avatarUrl: string;
</script>

<div
	class="fixed inset-y-0 z-30 h-[80px] w-full lg:pl-56 border-b-2 border-surface-300-600-token variant-glass-surface shadow-sm"
>
	<Navbar {user} {avatarUrl} />
</div>
<div class="fixed inset-y-0 z-30 hidden h-full w-56 flex-col lg:flex">
	<Sidebar />
</div>
