import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { registerSchema } from '$lib/form-schemas';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import { pbAdmin } from '$lib/server/pb-admin';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		form: await superValidate(zod(registerSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(registerSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await pbAdmin.collection('users').create(form.data);
			await pbAdmin.collection('users').requestVerification(form.data.email);
		} catch (e) {
			const { status, response } = e as ClientResponseError;

			if (response.data.email)
				if (response.data.email.code === 'validation_invalid_email') {
					return message(form, { status, message: 'Email already in use or not yet verified' });
				}

			return message(form, { status, message: 'An error occurred' });
		}
		return redirect(303, '/login?new_user=true');
	}
};
