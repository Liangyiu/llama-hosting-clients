<script lang="ts">
	import { themeStore } from '$lib/stores/stores';
	import { LightSwitch, popup } from '@skeletonlabs/skeleton';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { ChevronDownIcon, PaletteIcon } from 'lucide-svelte';

	const themes = [
		{ type: 'skeleton', name: 'Skeleton', icon: '💀' },
		{ type: 'wintry', name: 'Wintry', icon: '🌨️' },
		{ type: 'modern', name: 'Modern', icon: '🤖' },
		{ type: 'rocket', name: 'Rocket', icon: '🚀' },
		{ type: 'seafoam', name: 'Seafoam', icon: '🧜‍♀️' },
		{ type: 'vintage', name: 'Vintage', icon: '📺' },
		{ type: 'sahara', name: 'Sahara', icon: '🏜️' },
		{ type: 'hamlindigo', name: 'Hamlindigo', icon: '👔' },
		{ type: 'gold-nouveau', name: 'Gold Nouveau', icon: '💫' },
		{ type: 'crimson', name: 'Crimson', icon: '⭕' }
	];

	const setTheme: SubmitFunction = ({ formData }) => {
		const theme = formData.get('theme')?.toString();

		if (theme) {
			document.body.setAttribute('data-theme', theme);
			$themeStore = theme;
		}
	};
</script>

<div>
	<!-- trigger -->
	<button
		class="btn-icon md:hidden size-[46px] variant-ghost-surface hover:bg-surface-400-500-token transition-colors"
		use:popup={{ event: 'click', target: 'theme', closeQuery: 'a[href]' }}
	>
		<PaletteIcon size="22" />
	</button>

	<button
		class="btn hidden md:inline-block variant-ghost-surface hover:bg-surface-400-500-token transition-colors"
		use:popup={{ event: 'click', target: 'theme', closeQuery: 'a[href]' }}
	>
		<span class="inline-block">Theme</span>
		<ChevronDownIcon size="16" class="inline-block" />
	</button>

	<!-- popup -->
	<div class="card variant-glass-surface p-4 w-60 shadow-xl" data-popup="theme">
		<div class="space-y-4">
			<section class="flex justify-between items-center">
				<h6 class="h6">Mode</h6>
				<LightSwitch />
			</section>
			<hr />
			<nav class="list-nav p-4 -m-4 max-h-64 lg:max-h-[500px] overflow-y-auto">
				<form action="/dashboard/?/setTheme" method="post" use:enhance={setTheme}>
					<ul>
						<!-- , badge -->
						{#each themes as { icon, name, type }}
							<li>
								<button
									class="option w-full h-full"
									type="submit"
									name="theme"
									value={type}
									class:bg-primary-active-token={$themeStore === type}
								>
									<span>{icon}</span>
									<span class="flex-auto text-left">{name}</span>
									<!-- {#if badge}<span class="badge variant-filled-secondary">{badge}</span>{/if} -->
								</button>
							</li>
						{/each}
					</ul>
				</form>
			</nav>
		</div>
	</div>
</div>
