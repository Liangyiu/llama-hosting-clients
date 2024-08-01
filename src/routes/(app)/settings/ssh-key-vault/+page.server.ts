import { message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { addSshKeySchema } from '$lib/form-schemas';
import { fail } from '@sveltejs/kit';

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
