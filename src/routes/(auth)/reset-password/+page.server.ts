import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { resetPasswordSchema } from '$lib/form-schemas';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import type { PageServerLoad } from './$types';
import { pbAdmin } from '$lib/server/pb-admin';

export const load = (async () => {
	return {
		form: await superValidate(zod(resetPasswordSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(resetPasswordSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await pbAdmin.collection('users').requestPasswordReset(form.data.email);
		} catch (e) {
			const { status } = e as ClientResponseError;

			return message(form, { status, message: 'An error occurred' });
		}
		return redirect(303, '/reset-password/success');
	}
};
