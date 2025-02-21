import { Collections, type TicketsResponse } from '$lib/types/pocketbase-types';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const { user, pb } = locals;

	// TODO: return promise to page and await it with loader, ratelimiting

	const ticketsResponse = await pb.collection(Collections.Tickets).getFullList<TicketsResponse>({
		filter: pb.filter('user = {:userId}', { userId: user?.id }),
		fields: 'id,readable_id,subject,category,status,updated',
		sort: '-updated'
	});

	return {
		ticketsResponse
	};
}) satisfies PageServerLoad;
