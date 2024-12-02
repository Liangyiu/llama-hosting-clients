<script lang="ts">
	import Navbar from './Navbar.svelte';
	import Sidebar from './Sidebar.svelte';
</script>

<header>
	<div
		class="fixed inset-y-0 z-30 h-[80px] w-full lg:pl-56 border-b-2 border-surface-300-700 preset-glass-surface shadow-sm"
	>
		<Navbar />
	</div>
</header>
<div class="fixed inset-y-0 z-30 hidden h-full w-56 flex-col lg:flex">
	<Sidebar />
</div>
