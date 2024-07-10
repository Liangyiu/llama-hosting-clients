import { message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { accountDetailsSchema, avatarSchema } from '$lib/form-schemas';
import { fail, redirect } from '@sveltejs/kit';

export const load = (async () => {
	return {
		avatarForm: await superValidate(zod(avatarSchema)),
		accountDetailsForm: await superValidate(zod(accountDetailsSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	uploadAvatar: async (event) => {
		const {
			locals: { pb, user }
		} = event;

		const form = await superValidate(event, zod(avatarSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await pb.collection('user_details').update(user.user_details, form.data);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (_) {
			return message(form, 'An error occurred during avatar upload');
		}

		return message(form, 'Avatar uploaded successfully');
	},
	removeAvatar: async (event) => {
		const {
			locals: { pb, user }
		} = event;

		try {
			await pb.collection('user_details').update(user.user_details, {
				avatar: null
			});
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (_) {
			return redirect(303, '/settings/account?error=An+error+occurred+during+avatar+upload');
		}

		return;
	}
};
