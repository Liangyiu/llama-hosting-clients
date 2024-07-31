import { pbAdmin } from '$lib/server/pb-admin';
import { type UserDetailsRecord, type UserDetailsResponse } from '$lib/types/pbTypes';
import type { ClientResponseError } from 'pocketbase';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const { user, pb } = locals;

	if (user.user_details !== '') {
		try {
			const userDetails = await pb.from('user_details').getOne(user.user_details);

			if (userDetails.avatar === '') {
				return { user: locals.user, avatarUrl: '', userDetails };
			}

			const avatarUrl = await pb.getFileUrl(userDetails, userDetails.avatar);
			return { user: locals.user, avatarUrl, userDetails };
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (_) {
			return { user: locals.user, avatarUrl: '' };
		}
	}
	try {
		const userDetails = await pb
			.collection('user_details')
			.getFirstListItem<
				UserDetailsResponse<UserDetailsRecord>
			>('user="' + user?.id + '"', { requestKey: 'fetchUserDetails' });

		await pb.collection('users').update(user.id, {
			user_details: userDetails.id
		});

		const avatarUrl = await pb.getFileUrl(userDetails, userDetails.avatar);

		return { user: locals.user, avatarUrl, userDetails };
	} catch (e) {
		const { status } = e as ClientResponseError;
		if (status === 404) {
			try {
				const data = {
					user: user.id
				};

				const newUserDetails = await pbAdmin.collection('user_details').create(data);

				await pb.collection('users').update(user.id, {
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
