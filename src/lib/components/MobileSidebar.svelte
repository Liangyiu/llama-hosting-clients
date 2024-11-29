<script lang="ts">
	import { getDrawerStore, type DrawerSettings } from '@skeletonlabs/skeleton';
	import MenuIcon from 'lucide-svelte/icons/menu';

	const drawerStore = getDrawerStore();
	const settings: DrawerSettings = { id: 'example-1' };

	const openSidebar = () => {
		drawerStore.open(settings);
	};
</script>

<button class="btn-icon pr-4 transition hover:opacity-75 lg:hidden" onclick={openSidebar}>
	<MenuIcon />
</button>
