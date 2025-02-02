import { loginSchema } from '$lib/form-schemas';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { ClientResponseError } from 'pocketbase';
import { pbAdmin } from '$lib/server/pb-admin';
import { eq } from '@tigawanna/typed-pocketbase';
import { rateLimiters } from '$lib/server/rate-limiter';
import { validateTotpCode } from '$lib/server/totp';
import { Collections, type UsersResponse } from '$lib/types/pocketbase-types';
import { getClientTrueIp } from '$lib/utils/ip';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(loginSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const {
			locals: { pb }
		} = event;
		const form = await superValidate(event, zod(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const clientIp = getClientTrueIp(event.request, event.getClientAddress());

		const { success: ipSuccess } = await rateLimiters.loginIp.limit(clientIp);
		if (!ipSuccess) {
			return message(form, {
				status: 429,
				message: `Rate limit hit.`
			});
		}

		const { success: emailIpSuccess } = await rateLimiters.loginEmailIp.limit(
			form.data.email + clientIp
		);

		if (!emailIpSuccess) {
			return message(form, {
				status: 429,
				message: `Rate limit hit.`
			});
		}

		const { success, timeRemaining } = await rateLimiters.loginEmail.limit(form.data.email);

		if (!success) {
			return message(form, {
				status: 429,
				message: `Rate limit hit. Please try again in ${timeRemaining} ${timeRemaining === 1 ? 'second' : 'seconds'}`
			});
		}

		let secretId = '';
		let mfaEnabled = false;

		try {
			const user = await pbAdmin
				.collection(Collections.Users)
				.getFirstListItem<UsersResponse>(eq('email', form.data.email.toLowerCase()));

			if (user.mfa_totp) {
				secretId = user.mfa_totp_secret_id;
				mfaEnabled = true;

				if (!form.data.totp_code) {
					return message(form, {
						status: 400,
						message: 'Please enter your TOTP code'
					});
				}
			}
		} catch (e) {
			const { status } = e as ClientResponseError;

			return message(form, { status, message: 'An error occurred during authentication' });
		}

		if (mfaEnabled) {
			const { success: totpValid } = await validateTotpCode(secretId, form.data.totp_code || '');

			if (!totpValid) {
				return message(form, {
					status: 400,
					message: 'Invalid TOTP code'
				});
			}
		}

		try {
			await pb.collection('users').authWithPassword(form.data.email, form.data.password);

			return redirect(303, '/dashboard');
		} catch (e) {
			const { status, response } = e as ClientResponseError;

			if (status === 403) {
				return message(form, { status, message: 'Please verify your email' });
			} else if (status === 400 && response.message === 'Failed to authenticate.') {
				return message(form, { status, message: 'Invalid credentials' });
			}

			return message(form, { status, message: 'An error occurred during authentication' });
		}
	}
};
