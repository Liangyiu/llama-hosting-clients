import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { registerSchema } from '$lib/form-schemas';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import pbAdmin from '$lib/server/pb-admin';
import type { PageServerLoad } from './$types';
import {
	Collections,
	type UserDetailsResponse,
	type UsersResponse
} from '$lib/types/pocketbase-types';
import { getClientTrueIp } from '$lib/utility/ip';
import { rateLimiters } from '$lib/server/rate-limiter';

export const load = (async () => {
	return {
		form: await superValidate(zod(registerSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(registerSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const clientIp = getClientTrueIp(event.request, event.getClientAddress());

		const { success: successIp, timeRemaining: timeRemainingIp } =
			await rateLimiters.registerIp.limit(clientIp);
		if (!successIp) {
			return message(form, {
				status: 429,
				message: `Rate limit hit. Try again after ${timeRemainingIp} second(s))`
			});
		}

		const { success: successIpUa, timeRemaining: timeRemainingIpUa } =
			await rateLimiters.registerIpUa.limit(
				clientIp + ':' + event.request.headers.get('user-agent')
			);

		if (!successIpUa) {
			return message(form, {
				status: 429,
				message: `Rate limit hit. Try again after ${timeRemainingIpUa} second(s))`
			});
		}

		try {
			const newUser = await pbAdmin.collection(Collections.Users).create<UsersResponse>(form.data);

			await pbAdmin.collection('users').requestVerification(form.data.email);

			const newUserDetails = await pbAdmin
				.collection(Collections.UserDetails)
				.create<UserDetailsResponse>({
					user: newUser.id
				});

			await pbAdmin.collection('users').update(newUser.id, {
				user_details: newUserDetails.id
			});
		} catch (e) {
			const { status, response } = e as ClientResponseError;

			if (response?.data?.email)
				if (response.data.email.code === 'validation_not_unique') {
					return message(form, { status, message: 'Email already in use or not yet verified' });
				}

			return message(form, {
				status,
				message: 'An error occurred during the registration process'
			});
		}

		return redirect(303, '/login?new_user=true');
	}
};
