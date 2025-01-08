import { rateLimiters } from '$lib/server/rate-limiter';
import { getClientTrueIp, isPrivateIp } from '$lib/utils/ip';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const { request } = event;

	const clientIp = getClientTrueIp(request, event.getClientAddress());

	if (!isPrivateIp(clientIp)) {
		const { success, timeRemaining } = await rateLimiters.healthCheck.limit(clientIp);

		if (!success) {
			return new Response(
				JSON.stringify({
					message: `Rate limit hit. Try again in ${timeRemaining} second(s)`
				}),
				{
					status: 429
				}
			);
		}
	}

	return new Response(
		JSON.stringify({
			status: 'Healthy',
			uptime: process.uptime()
		})
	);
};
