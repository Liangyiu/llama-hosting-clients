<script lang="ts">
	import SettingsNavItem from './SettingsNavItem.svelte';

	interface Props {
		itemClicked: (item: { label: string; href: string }) => void;
		routes: {
			label: string;
			href: string;
		}[];
	}

	let { itemClicked, routes }: Props = $props();
</script>

<div class="flex w-full flex-col">
	{#each routes as { href, label }}
		<SettingsNavItem {itemClicked} {href} {label} />
	{/each}
</div>
