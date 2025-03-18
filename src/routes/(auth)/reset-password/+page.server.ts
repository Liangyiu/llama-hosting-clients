import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { resetPasswordSchema } from '$lib/form-schemas';
import { fail, type Actions } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import type { PageServerLoad } from './$types';
import { getClientTrueIp } from '$lib/utility/ip';
import { rateLimiters } from '$lib/server/rate-limiter';

export const load = (async () => {
	return {
		form: await superValidate(zod(resetPasswordSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const { pb } = event.locals;
		const form = await superValidate(event, zod(resetPasswordSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const clientIp = getClientTrueIp(event.request, event.getClientAddress());

		const { success: successIp, timeRemaining: timeRemainingIp } =
			await rateLimiters.passwordResetIp.limit(clientIp);

		if (!successIp) {
			return message(form, {
				status: 429,
				message: `Rate limit hit. Try again in ${timeRemainingIp} second(s)`
			});
		}

		const { success: successIpUa, timeRemaining: timeRemainingIpUa } =
			await rateLimiters.passwordResetIpUa.limit(
				clientIp + ':' + event.request.headers.get('user-agent')
			);

		if (!successIpUa) {
			return message(form, {
				status: 429,
				message: `Rate limit hit. Try again in ${timeRemainingIpUa} second(s)`
			});
		}

		try {
			await pb.collection('users').requestPasswordReset(form.data.email);
			return message(form, {
				status: 200,
				message: 'An email has been sent to ' + form.data.email
			});
		} catch (e) {
			const { status } = e as ClientResponseError;

			return message(form, {
				status,
				message: 'An error occurred during the password reset process'
			});
		}
	}
};
