import type { RequestHandler } from './$types';
import { rateLimiters } from '$lib/server/rate-limiter';
import { Collections } from '$lib/types/pocketbase-types';

export const DELETE: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) {
		return new Response(
			JSON.stringify({
				message: 'Not authenticated'
			}),
			{
				status: 403
			}
		);
	}

	const { success, timeRemaining } = await rateLimiters.sshKeyDelete.limit(locals.user.id);

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

	try {
		await locals.pb.collection(Collections.SshKeys).delete(params.id);

		return new Response(
			JSON.stringify({
				message: 'Success: Key removed from default list'
			}),
			{
				status: 200
			}
		);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (_) {
		return new Response(
			JSON.stringify({
				message: 'Error: Failed to remove default SSH key'
			}),
			{
				status: 500
			}
		);
	}
};
