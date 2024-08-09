import { and, eq } from 'typed-pocketbase';
import type { RequestHandler } from './$types';
import { error, type HttpError } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ locals, params }) => {
	try {
		const defaultKeys = await locals.pb.from('ssh_keys').getFullList({
			filter: and(eq('is_default', true), eq('user', locals.user.id))
		});

		console.log(defaultKeys.length);

		if (defaultKeys.length >= 5) {
			return error(403, {
				message: 'Maximum number of SSH keys reached'
			});
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
	} catch (e) {
		const { status } = e as HttpError;

		if (status === 403) {
			return error(403, {
				message: 'Maximum number of SSH keys reached'
			});
		}

		return error(500, {
			message: 'Error: Failed to add default SSH key'
		});
	}
};
