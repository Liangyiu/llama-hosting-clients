import { and, eq } from 'typed-pocketbase';
import type { RequestHandler } from './$types';
import { rateLimiters } from '$lib/server/rate-limiter';

export const PUT: RequestHandler = async ({ locals, params }) => {
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

	const { success, timeRemaining } = await rateLimiters.sshKeyDefaultAdd.limit(locals.user.id);

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
		const defaultKeys = await locals.pb.from('ssh_keys').getFullList({
			filter: and(eq('is_default', true), eq('user', locals.user.id))
		});

		if (defaultKeys.length >= 5) {
			return new Response(
				JSON.stringify({
					message: 'Maximum number of default SSH keys reached'
				}),
				{
					status: 403
				}
			);
		}

		await locals.pb.from('ssh_keys').update(params.id, {
			is_default: true
		});

		return new Response(
			JSON.stringify({
				message: 'Key added to default list'
			}),
			{
				status: 200
			}
		);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (_) {
		return new Response(
			JSON.stringify({
				message: 'Error: Failed to add default SSH key'
			}),
			{
				status: 500
			}
		);
	}
};
