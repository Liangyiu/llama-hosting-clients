import type { RequestHandler, RequestEvent } from './$types';
import { json } from '@sveltejs/kit';

export const GET = (async (event: RequestEvent) => {
	const {
		locals: { pb }
	} = event;

	pb.authStore.clear();

	return json({ message: 'Logged out successfully' });
}) satisfies RequestHandler;
