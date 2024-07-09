import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { registerSchema } from '$lib/form-schemas';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import { pbAdmin } from '$lib/server/pb-admin';
import type { PageServerLoad } from './$types';
import type {
	UsersRecord,
	UsersResponse,
	UserDetailsRecord,
	UserDetailsResponse
} from '$lib/types/pbTypes';

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
			const newUser = await pbAdmin
				.collection('users')
				.create<UsersResponse<UsersRecord>>(form.data);
			await pbAdmin.collection('users').requestVerification(form.data.email);

			const newUserDetails = await pbAdmin
				.collection('user_details')
				.create<UserDetailsResponse<UserDetailsRecord>>({
					user: newUser.id
				});

			await pbAdmin.collection('users').update(newUser.id, {
				user_details: newUserDetails.id
			});
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
