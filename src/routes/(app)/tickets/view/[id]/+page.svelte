<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import type { PageData } from './$types';
	import Loader2 from '~icons/lucide/loader2';
	import Time from 'svelte-time/Time.svelte';
	import { getUserState } from '$lib/stores/UserStore.svelte';
	import SendIcon from '~icons/lucide/send';
	import autosizeAction from 'svelte-autosize';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();
	const userState = getUserState();
	const { ticket, messages } = data;

	let newMessage = $state('');
	let chatElement: HTMLElement | undefined = $state();
	let newMessageInput: HTMLTextAreaElement | undefined = $state();

	const status = {
		closed: {
			text: 'Closed',
			class: 'badge preset-filled-surface-500'
		},
		open: {
			text: 'Open',
			class: 'badge preset-tonal-success'
		},
		answered: {
			text: 'Answered',
			class: 'badge preset-tonal-warning'
		},
		'customer-reply': {
			text: 'Customer Reply',
			class: 'badge preset-tonal-success'
		}
	};

	const priority = {
		'1-high': {
			text: 'High',
			class: 'badge preset-tonal-error'
		},
		'2-medium': {
			text: 'Medium',
			class: 'badge preset-tonal-warning'
		},
		'3-low': {
			text: 'Low',
			class: 'badge preset-filled-surface-500'
		}
	};

	const categories = {
		billing: 'Billing',
		'product-information': 'Product Information',
		other: 'Other',
		technical: 'Technical',
		outage: 'Outage'
	};

	function scrollChatBottom(behavior?: 'auto' | 'instant' | 'smooth') {
		chatElement?.scrollTo({ top: chatElement.scrollHeight, behavior });
	}

	onMount(() => {
		scrollChatBottom('smooth');
	});
</script>

<div class="w-full p-4">
	<section class="overflow-hidden">
		<div class="chat w-full h-full grid grid-cols-1 lg:grid-cols-[30%_1fr]">
			<!-- Navigation -->
			<div class="hidden lg:grid grid-rows-[auto_1fr_auto] border-r-[1px] border-surface-200-800">
				<!-- Ticket Information -->
				<div class="p-4 space-y-4 overflow-y-auto">
					<h1 class="h4 font-semibold">Ticket {ticket.readable_id}</h1>
					<p class="text-xl">{ticket.subject}</p>

					<div class="flex flex-col space-y-1">
						<p class="text-sm opacity-75">Priority</p>
						<p class="">
							<span class={priority[ticket.priority].class}>{priority[ticket.priority].text}</span>
						</p>

						<p class="text-sm opacity-75">Status</p>
						<p class="">
							<span class={status[ticket.status].class}>{status[ticket.status].text}</span>
						</p>
						<p class="text-sm opacity-75">Category</p>
						<p class="">
							<span class="badge preset-filled-surface-500">{categories[ticket.category]}</span>
						</p>
						<p class="text-sm opacity-75">Requester</p>
						<p class="">
							<span class="badge preset-filled-surface-500"
								>{ticket.expand.created_by.first_name +
									' ' +
									ticket.expand.created_by.last_name}</span
							>
							{#if ticket.created_by === userState.user}
								<span class="badge preset-tonal-success">You</span>
							{/if}
						</p>

						<p class="text-sm opacity-75">Updated</p>
						<p class="flex items-center gap-2 cursor-pointer">
							<span class="badge preset-filled-surface-500">
								<Time
									timestamp={ticket.updated}
									format="dddd @ h:mm A · MMMM D, YYYY"
									relative
									live
								/>
							</span>
						</p>
						<p class="text-sm opacity-75">Created</p>
						<p class="flex items-center gap-2">
							<span class="badge preset-filled-surface-500">
								<Time timestamp={ticket.created} format="dddd @ h:mm A · MMMM D, YYYY" />
							</span>
						</p>
					</div>
				</div>
			</div>
			<!-- Chat -->
			<div class="grid grid-row-[1fr_auto]">
				<section
					bind:this={chatElement}
					class="p-4 overflow-y-auto space-y-4 max-h-[calc(100vh-218px)]"
				>
					{#each messages as bubble, counter}
						{#if bubble.user === userState.user}
							<div
								class="grid grid-cols-[1fr_auto] gap-2"
								id={counter + 1 === messages.length ? 'latest-message' : ''}
							>
								<div class="card p-4 rounded-tr-none space-y-2 bg-secondary-100-900 !bg-opacity-75">
									<header class="flex justify-between items-center">
										<p class="font-bold">
											{bubble.expand.user.first_name + ' ' + bubble.expand.user.last_name}
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
									classes="sm:block hidden"
									src={userState.avatar}
									name={bubble.expand.user.first_name + ' ' + bubble.expand.user.last_name}
									size="size-12"
								/>
							</div>
						{:else}
							<div
								class="grid grid-cols-[auto_1fr] gap-2"
								id={counter + 1 === messages.length ? 'latest-message' : ''}
							>
								<Avatar
									src=""
									classes="sm:block hidden"
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
							</div>
						{/if}
					{/each}
				</section>
				<section class="border-t-[1px] border-surface-200-800 p-4">
					<div
						class="input-group grid-cols-[1fr_auto] divide-x divide-surface-200-800 rounded-container-token"
					>
						<textarea
							use:autosizeAction
							bind:value={newMessage}
							bind:this={newMessageInput}
							class="bg-transparent border-0 ring-0"
							name="new_message"
							id="new_message"
							placeholder="Write a message..."
							rows="1"
						></textarea>
						<button
							class="input-group-cell {newMessage ? 'preset-filled-primary-500' : 'preset-tonal'}"
						>
							<SendIcon class="size-[20px] rotate-45 -translate-x-1" />
						</button>
					</div>
				</section>
			</div>
		</div>
	</section>
</div>
