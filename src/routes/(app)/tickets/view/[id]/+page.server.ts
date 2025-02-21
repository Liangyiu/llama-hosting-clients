import {
	Collections,
	type TicketMessagesResponse,
	type TicketsResponse,
	type UsersResponse
} from '$lib/types/pocketbase-types';
import type { PageServerLoad } from './$types';
import pbAdmin from '$lib/server/pb-admin';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { ticketMessageSchema } from '$lib/form-schemas';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { rateLimiters } from '$lib/server/rate-limiter';
import { message } from 'sveltekit-superforms';

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
			filter: pbAdmin.filter('ticket = {:ticketId}', { ticketId: ticketId }),
			sort: '+created',
			expand: 'user'
		});

	return {
		ticket,
		messages,
		newMessageForm: await superValidate(zod(ticketMessageSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	sendNewTicketMessage: async (event) => {
		const { id: ticketId } = event.params;

		const {
			locals: { pb, user }
		} = event;

		const form = await superValidate(event, zod(ticketMessageSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		if (!user) {
			return fail(401, { form });
		}

		const { success, timeRemaining } = await rateLimiters.createTicketMessage.limit(user.id);

		if (!success) {
			return message(form, {
				status: 429,
				message: `Rate limit hit. Please try again in ${timeRemaining} ${timeRemaining === 1 ? 'second' : 'seconds'}`
			});
		}

		const transformedMessage = form.data.message.replaceAll('\n', '#####new_line#####');

		try {
			await pb.collection(Collections.TicketMessages).create({
				user: user.id,
				message: transformedMessage,
				ticket: ticketId
			});

			return message(form, { status: 200, message: 'Message sent' });
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (_) {
			return message(form, { status: 400, message: 'Error: Failed to send message' });
		}
	}
};
