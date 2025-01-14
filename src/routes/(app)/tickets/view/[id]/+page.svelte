<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import type { PageData } from './$types';
	import Loader2 from '~icons/lucide/loader2';
	import Time from 'svelte-time/Time.svelte';
	import { getUserState } from '$lib/stores/UserStore.svelte';

	let { data }: { data: PageData } = $props();
	const userState = getUserState();
	let chatElement: HTMLElement | undefined = $state();
</script>

<div class="w-full p-4">
	<h1 class="text-3xl font-semibold">subject: {data.ticket.subject}</h1>

	<h3 class="text-2xl">id: {data.ticket.id}</h3>

	<h4 class="h4">status: {data.ticket.status}</h4>

	{#await data.messagesResponse}
		<div class="w-full justify-center">
			<Loader2 class="animate-spin size-12" />
		</div>
	{:then messages}
		<section bind:this={chatElement} class="max-h-screen p-4 overflow-y-auto space-y-4">
			{#each messages as bubble}
				{#if bubble.user === userState.user}
					<div class="grid grid-cols-[auto_1fr] gap-2">
						<Avatar
							src={userState.avatar}
							name={bubble.expand.user.first_name + ' ' + bubble.expand.user.last_name}
							size="size-12"
						/>
						<div class="card p-4 preset-tonal rounded-tl-none space-y-2">
							<header class="flex justify-between items-center">
								<p class="font-bold">
									{bubble.expand.user.first_name +
										' ' +
										bubble.expand.user.last_name.slice(0, 1) +
										'.'}
								</p>
								<small class="opacity-50"
									><Time
										timestamp={bubble.created}
										relative
										live
										format="dddd @ h:mm A · MMMM D, YYYY"
									/></small
								>
							</header>
							<p>{bubble.message}</p>
						</div>
					</div>
				{:else}
					<div class="grid grid-cols-[1fr_auto] gap-2">
						<div class="card p-4 rounded-tr-none space-y-2 bg-secondary-100-900 !bg-opacity-75">
							<header class="flex justify-between items-center">
								<p class="font-bold">
									{bubble.expand.user.first_name +
										' ' +
										bubble.expand.user.last_name.slice(0, 1) +
										'.'}
								</p>
								<small class="opacity-50">
									<Time
										timestamp={bubble.created}
										relative
										live
										format="dddd @ h:mm A · MMMM D, YYYY"
									/>
								</small>
							</header>
							<p>{bubble.message}</p>
						</div>
						<Avatar
							src=""
							name={bubble.expand.user.first_name + ' ' + bubble.expand.user.last_name}
							size="size-12"
						/>
					</div>
				{/if}
			{/each}
		</section>
	{:catch _}
		an error occurred
	{/await}
</div>
