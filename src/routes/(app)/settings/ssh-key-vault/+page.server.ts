import { message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { addSshKeySchema } from '$lib/form-schemas';
import { fail } from '@sveltejs/kit';
import { and, eq } from 'typed-pocketbase';
import { rateLimiters } from '$lib/server/rate-limiter';

export const load = (async ({ locals, url }) => {
	const { pb, user } = locals;
	const page = parseInt(url.searchParams.get('page') || '1');
	const pageSize = parseInt(url.searchParams.get('pageSize') || '5');

	return {
		page,
		pageSize,
		sshKeyForm: await superValidate(zod(addSshKeySchema)),
		sshKeysPagePromise: pb.from('ssh_keys').getList(page, pageSize, {
			filter: eq('user', user.id),
			sort: '-created'
		})
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	addSshKey: async (event) => {
		const {
			locals: { pb, user }
		} = event;

		const form = await superValidate(event, zod(addSshKeySchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { success, timeRemaining } = await rateLimiters.sshKeyAdd.limit(user.id);

		if (!success) {
			return message(form, {
				status: 429,
				message: `Rate limit hit. Please try again in ${timeRemaining} ${timeRemaining === 1 ? 'second' : 'seconds'}`
			});
		}

		try {
			const key = await pb.from('ssh_keys').getFullList({
				filter: and(eq('public_key', form.data.public_key), eq('user', user.id))
			});

			if (key.length > 0) {
				return message(form, { status: 400, message: 'SSH key already exists' });
			}

			await pb.from('ssh_keys').create({
				user: user.id,
				public_key: form.data.public_key,
				key_name: form.data.key_name
			});

			return message(form, { status: 200, message: 'SSH key added successfully' });
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (_) {
			return message(form, { status: 400, message: 'Error: Failed to add SSH key' });
		}
	}
};
