<script lang="ts">
	interface Props {
		pathname: string;
	}

	let { pathname }: Props = $props();

	const crumbs = pathname.split('/').filter((crumb) => crumb !== '');

	function getHref(index: number) {
		return crumbs.slice(0, index + 1).join('/');
	}

	function capitalizeFirstLetter(string: string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
</script>

<div>
	<ol class="breadcrumb text-sm">
		{#each crumbs as crumb, i}
			{#if i === 0}
				<li class="crumb">
					<a class="anchor" href="/{crumb}">{capitalizeFirstLetter(crumb)}</a>
				</li>
			{:else}
				<li class="crumb">
					<a class="anchor" href="/{getHref(i)}">{capitalizeFirstLetter(crumb)}</a>
				</li>
			{/if}

			{#if crumbs.length !== i + 1}
				<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
			{/if}
		{/each}
	</ol>
</div>
