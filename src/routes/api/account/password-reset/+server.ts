import { rateLimiters } from '$lib/server/rate-limiter';
import { validateTotpCode } from '$lib/server/totp';
import { type UsersRecord } from '$lib/types/pocketbase-types';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const { pb } = locals;

	const user = locals.user as UsersRecord;

	if (!user) {
		return new Response(
			JSON.stringify({
				message: 'Not authenticated'
			}),
			{
				status: 403
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

	const { totpCode } = await request.json();

	if (user.mfa_totp) {
		if (!totpCode) {
			return new Response(
				JSON.stringify({
					message: 'TOTP code is required'
				}),
				{
					status: 400
				}
			);
		}

		const {
			message,
			status,
			success: successValidate
		} = await validateTotpCode(user.mfa_totp_secret_id || '', totpCode);

		if (!successValidate) {
			return new Response(
				JSON.stringify({
					message
				}),
				{
					status
				}
			);
		}
	}

	try {
		await pb.collection('users').requestPasswordReset(user.email);

		return new Response(
			JSON.stringify({
				message: 'Password reset mail sent'
			}),
			{
				status: 200
			}
		);
	} catch {
		return new Response(
			JSON.stringify({
				message: 'An error occurred while sending your password reset email'
			}),
			{
				status: 500
			}
		);
	}
};
