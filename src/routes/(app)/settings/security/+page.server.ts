import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { rateLimiters } from '$lib/server/rate-limiter';
import type { PageServerLoad } from './$types';
import { activateTotpSchema, deactivateTotpSchema } from '$lib/form-schemas';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { TOTP } from 'otpauth';
import { pbAdmin } from '$lib/server/pb-admin';
import { validateTotpCode } from '$lib/server/totp';

export const load = (async () => {
	return {
		activateTotp: await superValidate(zod(activateTotpSchema)),
		deactivateTotp: await superValidate(zod(deactivateTotpSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	resetPassword: async ({ request, locals }) => {
		const { user } = locals;

		if (!user) {
			return new Response(
				JSON.stringify({
					message: 'Not authenticated'
				}),
				{
					status: 401
				}
			);
		}

		const formData = await request.formData();
		const email = formData.get('email')?.toString();
		if (!email) {
			return new Response(
				JSON.stringify({
					message: 'Email is required'
				}),
				{
					status: 400
				}
			);
		}

		const { success, timeRemaining } = await rateLimiters.passwordReset.limit(user.id);

		if (!success) {
			return new Response(
				JSON.stringify({
					message: `Rate limit hit. Please try again in ${timeRemaining} ${timeRemaining === 1 ? 'second' : 'seconds'}`
				}),
				{
					status: 429
				}
			);
		}

		await locals.pb.collection('users').requestPasswordReset(email);
		return redirect(303, '/settings/security?passwordReset=true');
	},
	activateTotp: async (event) => {
		const {
			locals: { pb, user }
		} = event;

		const form = await superValidate(event, zod(activateTotpSchema));

		if (!user) {
			return fail(400, { form });
		}

		if (!form.valid) {
			return fail(400, { form });
		}

		if (user.mfa_totp) {
			return message(form, {
				status: 400,
				message: '2FA/TOTP already activated'
			});
		}

		console.log(form.data);

		const { success, timeRemaining } = await rateLimiters.activateTotp.limit(user.id);

		if (!success) {
			return message(form, {
				status: 429,
				message: `Rate limit hit. Please try again in ${timeRemaining} ${timeRemaining === 1 ? 'second' : 'seconds'}`
			});
		}

		const totp = new TOTP({
			secret: form.data.totp_secret,
			digits: 6,
			period: 30,
			algorithm: 'SHA1'
		});

		const delta = totp.validate({
			token: form.data.totp_code,
			window: 1
		});

		if (delta === null) {
			return message(form, {
				status: 400,
				message: 'Invalid TOTP code'
			});
		}

		try {
			const { id } = await pbAdmin.from('user_mfa_totp_secrets').create({
				user: user.id,
				secret: form.data.totp_secret
			});

			await pb.from('users').update(user.id, {
				mfa_totp: true,
				mfa_totp_secret_id: id
			});

			user.mfa_totp = true;
			user.mfa_totp_secret_id = id;
		} catch {
			return message(form, {
				status: 400,
				message: 'An error occurred while activating 2FA/TOTP'
			});
		}

		return message(form, {
			status: 200,
			message: 'Successfully activated 2FA/TOTP'
		});
	},
	deactivateTotp: async (event) => {
		const {
			locals: { pb, user }
		} = event;

		const form = await superValidate(event, zod(deactivateTotpSchema));

		if (!user) {
			return fail(400, { form });
		}

		if (!form.valid) {
			return fail(400, { form });
		}

		if (!user.mfa_totp) {
			return message(form, {
				status: 400,
				message: '2FA/TOTP not activated'
			});
		}

		const { success, timeRemaining } = await rateLimiters.deactivateTotp.limit(user.id);

		if (!success) {
			return message(form, {
				status: 429,
				message: `Rate limit hit. Please try again in ${timeRemaining} ${timeRemaining === 1 ? 'second' : 'seconds'}`
			});
		}

		const {
			message: returnMessage,
			status,
			success: successValidate
		} = await validateTotpCode(user.mfa_totp_secret_id, form.data.totp_code);

		if (successValidate) {
			try {
				await pb.from('users').update(user.id, {
					mfa_totp: false,
					mfa_totp_secret_id: undefined
				});

				await pbAdmin.from('user_mfa_totp_secrets').delete(user.mfa_totp_secret_id);

				user.mfa_totp = false;
				user.mfa_totp_secret_id = '';

				return message(form, {
					status,
					message: '2FA/TOTP deactivated'
				});
			} catch {
				return message(form, {
					status: 500,
					message: 'An error occurred while deactivating 2FA/TOTP'
				});
			}
		} else {
			return message(form, {
				status,
				message: returnMessage
			});
		}
	}
};
