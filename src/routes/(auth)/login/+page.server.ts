import { loginSchema } from '$lib/form-schemas';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { ClientResponseError } from 'pocketbase';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(loginSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const {
			locals: { pb }
		} = event;
		const form = await superValidate(event, zod(loginSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await pb.collection('users').authWithPassword(form.data.email, form.data.password);
		} catch (e) {
			const { status, response } = e as ClientResponseError;

			if (status === 403) {
				return message(form, { status, message: 'Please verify your email' });
			} else if (status === 400 && response.message === 'Failed to authenticate.') {
				return message(form, { status, message: 'Invalid credentials' });
			}

			return message(form, { status, message: 'An error occurred during authentication' });
		}
		return redirect(303, '/dashboard');
	}
};
