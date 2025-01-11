<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
    import Time from 'svelte-time'
	const { data }: { data: PageData } = $props();

	const categories = {
		'billing': 'Billing',
		'product-information': 'Product Information',
		'other': 'Other',
		'technical': 'Technical',
		'outage': 'Outage'
	}

    const status = {
        'closed': 'Closed',
        'open': 'Open',
        'answered': 'Answered',
        'customer-reply': 'Customer-Reply'
    }

	let page = $state(1);
	let pageSize = $state(10);
</script>

<div class="w-full p-4">
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
			<tbody>
				{#each data.tickets as ticket}
					<tr class="cursor-pointer transition-all h-16 hover:bg-opacity-25 hover:text-secondary-600-400 hover:bg-surface-800 min-w-26" onclick={() => 
				goto(`/tickets/view/${ticket.id}`)}>
						<td>{categories[ticket.category]}</td>
						<td class="truncate max-w-52 md:max-w-0">{ticket.subject}</td>
						<td>{status[ticket.status]}</td>
						<td><Time timestamp={ticket.updated} relative live /></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
