import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ locals, params }) => {
	try {
		await locals.pb.from('ssh_keys').update(params.id, {
			is_default: false
		});

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
		return error(500, {
			message: 'Error: Failed to remove default SSH key'
		});
	}
};
