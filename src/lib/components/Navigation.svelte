<script lang="ts">
	import { getUserState } from '$lib/stores/userStore';
	import type { UsersRecord } from '$lib/types/pbTypes';
	import Navbar from './Navbar.svelte';
	import Sidebar from './Sidebar.svelte';
</script>

<div
	class="fixed inset-y-0 z-30 h-[80px] w-full lg:pl-56 border-b-2 border-surface-300-600-token variant-glass-surface shadow-sm"
>
	<Navbar />
</div>
<div class="fixed inset-y-0 z-30 hidden h-full w-56 flex-col lg:flex">
	<Sidebar />
</div>
