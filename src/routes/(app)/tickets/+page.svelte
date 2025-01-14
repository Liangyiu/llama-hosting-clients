<script lang="ts">
	import { goto } from '$app/navigation';
	import { Pagination } from '@skeletonlabs/skeleton-svelte';
	import type { PageData } from './$types';
	import Time from 'svelte-time';
	import IconArrowLeft from '~icons/lucide/arrow-left';
	import IconArrowRight from '~icons/lucide/arrow-right';
	import IconEllipsis from '~icons/lucide/ellipsis';
	import IconFirst from '~icons/lucide/chevrons-left';
	import IconLast from '~icons/lucide/chevron-right';
	import autoAnimate from '@formkit/auto-animate';
	import type { TicketsResponse } from '$lib/types/pocketbase-types';
	import Loader2 from '~icons/lucide/loader2';

	const { data }: { data: PageData } = $props();

	const categories = {
		billing: 'Billing',
		'product-information': 'Product Information',
		other: 'Other',
		technical: 'Technical',
		outage: 'Outage'
	};

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

	let page = $state(1);
	let pageSize = $state(10);
	const slicedData = $derived((s: TicketsResponse[]) =>
		s.slice((page - 1) * pageSize, page * pageSize)
	);
</script>

<div class="w-full p-4">
	<h2 class="h2">Tickets</h2>

	{#await data.ticketsResponse}
		<div class="w-full justify-center">
			<Loader2 class="animate-spin size-12" />
		</div>
	{:then tickets}
		<div class="table-wrap">
			<table class="table md:table-fixed">
				<thead>
					<tr>
						<th>Category</th>
						<th>Subject</th>
						<th>Status</th>
						<th>Last Updated</th>
					</tr>
				</thead>
				<tbody use:autoAnimate>
					{#each slicedData(tickets) as ticket (ticket.id)}
						<tr
							class="cursor-pointer transition-all h-16 hover:bg-opacity-40 hover:bg-surface-800 min-w-26"
							onclick={() => goto(`/tickets/view/${ticket.id}`)}
						>
							<td>
								{categories[ticket.category]}
							</td>
							<td class="truncate max-w-52 md:max-w-0">
								{ticket.subject}
							</td>
							<td>
								<span class={status[ticket.status].class}>{status[ticket.status].text}</span>
							</td>
							<td>
								<span class="badge preset-filled-surface-500">
									<Time
										timestamp={ticket.updated}
										relative
										live
										format="dddd @ h:mm A · MMMM D, YYYY"
									/>
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<footer class="sm:flex sm:justify-between mt-2">
			<select name="size" id="size" class="select max-w-[150px] sm:mb-0 mb-4" bind:value={pageSize}>
				{#each [5, 10, 15] as v}
					<option value={v}>Items {v}</option>
				{/each}
				<option value={tickets.length}>Show All</option>
			</select>

			<Pagination
				data={tickets}
				bind:page
				bind:pageSize
				onPageChange={(details) => {
					page = details.page;
				}}
				onPageSizeChange={(details) => {
					pageSize = details.pageSize;
				}}
			>
				{#snippet labelEllipsis()}<IconEllipsis class="size-4" />{/snippet}
				{#snippet labelNext()}<IconArrowRight class="size-4" />{/snippet}
				{#snippet labelPrevious()}<IconArrowLeft class="size-4" />{/snippet}
				{#snippet labelFirst()}<IconFirst class="size-4" />{/snippet}
				{#snippet labelLast()}<IconLast class="size-4" />{/snippet}
			</Pagination>
		</footer>
	{:catch _}
		an error occurred
	{/await}
</div>
