import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { rateLimiters } from '$lib/server/rate-limiter';

export const actions: Actions = {
	resetPassword: async ({ request, locals }) => {
		const { user } = locals;

		const formData = await request.formData();
		const email = formData.get('email')?.toString();
		if (!email) {
			return new Response(
				JSON.stringify({
					message: 'Email is required'
				}),
				{
					status: 400
				}
			);
		}

		const { success, timeRemaining } = await rateLimiters.passwordReset.limit(user.id);

		if (!success) {
			return new Response(
				JSON.stringify({
					message: `Rate limit hit. Please try again in ${timeRemaining} ${timeRemaining === 1 ? 'second' : 'seconds'}`
				}),
				{
					status: 429
				}
			);
		}

		await locals.pb.collection('users').requestPasswordReset(email);
		return redirect(303, '/settings/security?passwordReset=true');
	}
};

// import { error, redirect } from '@sveltejs/kit';
// import type { Actions } from './$types';
// import { message } from 'sveltekit-superforms';
// import type { ClientResponseError } from 'pocketbase';

// export const actions: Actions = {
// 	resetPassword: async ({ locals }) => {
// 		const email = locals.user.email;

// 		try {
// 		await locals.pb.collection('users').requestPasswordReset(email);

// 		} catch (e) {
// 			const {status} = e as ClientResponseError
// 			return message()
// 		}

// 		return redirect(303, '/settings/security?passwordReset=true');
// 	}
// };
