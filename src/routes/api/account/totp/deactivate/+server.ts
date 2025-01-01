import { rateLimiters } from '$lib/server/rate-limiter';
import type { RequestHandler } from './$types';
import { validateTotpCode } from '$lib/server/totp';
import { pbAdmin } from '$lib/server/pb-admin';
import { Collections } from '$lib/types/pocketbase-types';

interface ValidateTotpCodeI {
	totp_code: string;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const { user, pb } = locals;

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

	if (!user.mfa_totp) {
		return new Response(
			JSON.stringify({
				message: '2FA/TOTP not activated'
			}),
			{
				status: 400
			}
		);
	}

	const data = (await request.json()) as ValidateTotpCodeI;

	if (!data.totp_code) {
		return new Response(
			JSON.stringify({
				message: 'TOTP code is required'
			}),
			{
				status: 400
			}
		);
	}

	const { success, timeRemaining } = await rateLimiters.deactivateTotp.limit(user.id);

	if (!success) {
		return new Response(
			JSON.stringify({
				message: `Rate limit exceeded. Please try again in ' + timeRemaining + ' ${timeRemaining === 1 ? 'second' : 'seconds'}`
			}),
			{
				status: 429
			}
		);
	}

	const {
		message,
		status,
		success: successValidate
	} = await validateTotpCode(user.mfa_totp_secret_id, data.totp_code);

	if (successValidate) {
		try {
			await pb.collection(Collections.Users).update(user.id, {
				mfa_totp: false,
				mfa_totp_secret_id: undefined
			});

			await pbAdmin.collection(Collections.UserMfaTotpSecrets).delete(user.mfa_totp_secret_id);

			return new Response(
				JSON.stringify({
					message: '2FA/TOTP deactivated'
				}),
				{
					status
				}
			);
		} catch {
			return new Response(
				JSON.stringify({
					message: 'An error occurred while deactivating 2FA/TOTP'
				}),
				{
					status: 500
				}
			);
		}
	} else {
		return new Response(
			JSON.stringify({
				message
			}),
			{
				status
			}
		);
	}
};
