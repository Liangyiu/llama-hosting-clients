<script lang="ts">
	import { themeStore } from '$lib/stores/stores';
	import { LightSwitch, popup } from '@skeletonlabs/skeleton';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { ChevronDownIcon } from 'lucide-svelte';

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
		class="btn variant-ghost-surface hover:variant-soft-primary"
		use:popup={{ event: 'click', target: 'theme', closeQuery: 'a[href]' }}
	>
		<span class="hidden md:inline-block">Theme</span>
		<ChevronDownIcon size="16" />
	</button>
	<!-- popup -->
	<div class="card p-4 w-60 shadow-xl" data-popup="theme">
		<div class="space-y-4">
			<nav class="list-nav p-4 -m-4 max-h-64 lg:max-h-[500px] overflow-y-auto">
				<form action="/clients/dashboard/?/setTheme" method="post" use:enhance={setTheme}>
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
