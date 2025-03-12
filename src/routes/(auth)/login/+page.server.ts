import { loginSchema } from '$lib/form-schemas';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { ClientResponseError } from 'pocketbase';
import pbAdmin from '$lib/server/pb-admin';
import { rateLimiters } from '$lib/server/rate-limiter';
import { validateTotpCode } from '$lib/server/utility/totp';
import { Collections, type UsersResponse } from '$lib/types/pocketbase-types';
import { getClientTrueIp } from '$lib/utility/ip';
import { getTotpSettings } from '$lib/server/utility/db';

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

		const { success: successIp } = await rateLimiters.loginIp.limit(clientIp);
		if (!successIp) {
			return message(form, {
				status: 429,
				message: `Rate limit hit.`
			});
		}

		const { success: successIpUa } = await rateLimiters.loginIpUa.limit(
			clientIp + ':' + event.request.headers.get('user-agent')
		);

		if (!successIpUa) {
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

		let totpSettings = undefined;

		try {
			totpSettings = await getTotpSettings({ userEmail: form.data.email });
		} catch (e) {
			const error = e as ClientResponseError;

			if (error.status === 404) {
				return message(form, {
					status: 404,
					message: 'No account associated with ' + form.data.email
				});
			}
			return message(form, {
				status: error.status,
				message: 'An error occurred during authentication'
			});
		}

		if (totpSettings) {
			if (totpSettings.enabled) {
				if (!form.data.totp_code) {
					return message(form, {
						status: 400,
						message: 'Please enter your TOTP code'
					});
				} else {
					if (totpSettings.secretId) {
						const { success: totpValid } = await validateTotpCode(
							totpSettings.secretId,
							form.data.totp_code || ''
						);

						if (!totpValid) {
							return message(form, {
								status: 400,
								message: 'Invalid TOTP code'
							});
						}
					} else {
						return message(form, {
							status: 500,
							message: 'There has been an error in the TOTP setup'
						});
					}
				}
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
