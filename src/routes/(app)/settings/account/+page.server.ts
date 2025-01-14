import { message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { accountDetailsSchema, avatarSchema, changeEmailSchema } from '$lib/form-schemas';
import { fail, redirect } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import { rateLimiters } from '$lib/server/rate-limiter';
import { Collections } from '$lib/types/pocketbase-types';

export const load = (async () => {
	return {
		avatarForm: await superValidate(zod(avatarSchema)),
		accountDetailsForm: await superValidate(zod(accountDetailsSchema)),
		emailChangeForm: await superValidate(zod(changeEmailSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	updateAccountDetails: async (event) => {
		const {
			locals: { pb, user }
		} = event;

		const form = await superValidate(event, zod(accountDetailsSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { success, timeRemaining } = await rateLimiters.accountDetailsUpdate.limit(user.id);

		if (!success) {
			return message(form, {
				status: 429,
				message: `Rate limit hit. Please try again in ${timeRemaining} ${timeRemaining === 1 ? 'second' : 'seconds'}`
			});
		}

		try {
			await pb.collection(Collections.Users).update(user.id, {
				first_name: form.data.first_name,
				last_name: form.data.last_name
			});
			await pb.collection(Collections.UserDetails).update(user.user_details, form.data);
			return message(form, {
				status: 200,
				message: 'Account details updated successfully'
			});
		} catch (e) {
			const { status } = e as ClientResponseError;
			return message(form, {
				status: status,
				message: 'An error occurred during account details update'
			});
		}
	},
	updateEmail: async (event) => {
		const {
			locals: { pb, user }
		} = event;

		const form = await superValidate(event, zod(changeEmailSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { success, timeRemaining } = await rateLimiters.emailChange.limit(user.id);

		if (!success) {
			return message(form, {
				status: 429,
				message: `Rate limit hit. Please try again in ${timeRemaining} ${timeRemaining === 1 ? 'second' : 'seconds'}`
			});
		}

		try {
			await pb.collection('users').requestEmailChange(form.data.email);
			return message(form, {
				status: 200,
				message: 'An email has been sent to ' + form.data.email
			});
		} catch (e) {
			const { status } = e as ClientResponseError;
			return message(form, {
				status: status,
				message: 'An error occurred during the email change process'
			});
		}
	}
};
