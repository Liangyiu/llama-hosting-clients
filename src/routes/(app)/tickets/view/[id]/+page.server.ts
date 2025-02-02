import {
	Collections,
	type TicketMessagesResponse,
	type TicketsResponse,
	type UsersResponse
} from '$lib/types/pocketbase-types';
import { eq } from '@tigawanna/typed-pocketbase';
import type { PageServerLoad } from './$types';
import { pbAdmin } from '$lib/server/pb-admin';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { ticketMessageSchema } from '$lib/form-schemas';

export const load = (async ({ locals, params }) => {
	const { user } = locals;
	const { id: ticketId } = params;

	interface messagesWithUsers extends TicketMessagesResponse {
		expand: {
			user: UsersResponse;
		};
	}

	interface ticketWithCreator extends TicketsResponse {
		expand: {
			created_by: UsersResponse;
		};
	}

	const ticket = await pbAdmin.collection(Collections.Tickets).getOne<ticketWithCreator>(ticketId, {
		expand: 'created_by'
	});

	// TODO: add ability for admins/support staff roles to access tickets

	if (ticket.user !== user?.id) {
		return error(401, {
			errorId: crypto.randomUUID(),
			message: 'You are not authorized to access this ticket.'
		});
	}

	const messages = await pbAdmin
		.collection(Collections.TicketMessages)
		.getFullList<messagesWithUsers>({
			filter: eq('ticket', ticketId),
			sort: '+created',
			expand: 'user'
		});

	return {
		ticket,
		messages,
		newMessageForm: await superValidate(zod(ticketMessageSchema))
	};
}) satisfies PageServerLoad;
