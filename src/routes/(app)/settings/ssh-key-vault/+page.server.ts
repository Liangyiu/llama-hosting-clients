import { message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { addSshKeySchema } from '$lib/form-schemas';
import { fail } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import { and, eq } from 'typed-pocketbase';

export const load = (async () => {
	return {
		sshKeyForm: await superValidate(zod(addSshKeySchema))
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
		} catch (e) {
			console.log(e);

			return message(form, { status: 400, message: 'Error: Failed to add SSH key' });
		}
	}
};
