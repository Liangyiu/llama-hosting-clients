import { rateLimiters } from '$lib/server/rate-limiter';
import type { RequestHandler } from './$types';
import { validateTotpCode } from '$lib/server/totp';

interface ValidateTotpCodeI {
	totp_code: string;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const { user } = locals;

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

	const { success, timeRemaining } = await rateLimiters.validateTotpCode.limit(user.id);

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

	const { message, status } = await validateTotpCode(user.mfa_totp_secret_id, data.totp_code);

	return new Response(
		JSON.stringify({
			message
		}),
		{
			status
		}
	);
};
