import { pbAdmin } from '$lib/server/pb-admin';
import type { ClientResponseError } from 'pocketbase';
import type { LayoutServerLoad } from './$types';
import { eq } from 'typed-pocketbase';
import { Collections, type UserDetailsResponse } from '$lib/types/pocketbase-types';

export const load = (async ({ locals }) => {
	const { user, pb } = locals;

	if (user?.user_details !== '') {
		try {
			const userDetails = await pb
				.collection(Collections.UserDetails)
				.getOne<UserDetailsResponse>(user.user_details);

			if (userDetails.avatar === '') {
				return { user: locals.user, avatarUrl: '', userDetails };
			}

			const avatarUrl = await pb.files.getURL(userDetails, userDetails.avatar);
			return { user: locals.user, avatarUrl, userDetails };
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (_) {
			return { user: locals.user, avatarUrl: '' };
		}
	}
	try {
		const userDetails = await pb
			.collection(Collections.UserDetails)
			.getFirstListItem<UserDetailsResponse>(eq('user', user.id), {
				requestKey: 'fetchUserDetails'
			});

		await pb.collection(Collections.Users).update(user.id, {
			user_details: userDetails.id
		});

		const avatarUrl = await pb.files.getURL(userDetails, userDetails.avatar);

		return { user: locals.user, avatarUrl, userDetails };
	} catch (e) {
		const { status } = e as ClientResponseError;
		if (status === 404) {
			try {
				const data = {
					user: user.id
				};

				const newUserDetails = await pbAdmin
					.collection(Collections.UserDetails)
					.create<UserDetailsResponse>(data);

				await pb.collection(Collections.Users).update(user.id, {
					user_details: newUserDetails.id
				});

				return { user: locals.user, userDetails: newUserDetails, avatarUrl: '' };
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (_) {
				return { user: locals.user, avatarUrl: '' };
			}
		}
		return { user: locals.user, avatarUrl: '' };
	}
}) satisfies LayoutServerLoad;
