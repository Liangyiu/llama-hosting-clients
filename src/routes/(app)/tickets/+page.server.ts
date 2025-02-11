import { Collections, type TicketsResponse } from '$lib/types/pocketbase-types';
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { ticketMessageSchema } from '$lib/form-schemas';
import { fail } from '@sveltejs/kit';
import { rateLimiters } from '$lib/server/rate-limiter';

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

export const actions: Actions = {
	sendNewTicketMessage: async (event) => {
		const {
			locals: { pb, user }
		} = event;

		const form = await superValidate(event, zod(ticketMessageSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		console.log(form.data.message);

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

		try {
			await pb.collection(Collections.TicketMessages).create({
				user: user.id,
				message: form.data.message,
				ticket: form.data.ticketId
			});

			return message(form, { status: 200, message: 'Message sent' });
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (_) {
			return message(form, { status: 400, message: 'Error: Failed to send message' });
		}
	}
};
