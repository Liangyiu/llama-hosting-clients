import { Collections, type TicketsResponse } from '$lib/types/pocketbase-types';
import { eq } from 'typed-pocketbase';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const { user, pb } = locals;

	const tickets = await pb.collection(Collections.Tickets).getFullList<TicketsResponse>({
		filter: eq('user', user.id),
		fields: 'id,readable_id,subject,category,status,updated',
		sort: '-updated'
	});

	return {
		tickets
	};
}) satisfies PageServerLoad;
