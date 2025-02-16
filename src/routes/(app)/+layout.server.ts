import pbAdmin from '$lib/server/pb-admin';
import type { ClientResponseError } from 'pocketbase';
import type { LayoutServerLoad } from './$types';
import { Collections, type UserDetailsResponse } from '$lib/types/pocketbase-types';
import { getAvatarUri } from '$lib/utils/avatar';

export const load = (async ({ locals }) => {
	const { user, pb } = locals;

	if (user?.user_details !== '') {
		try {
			const userDetails = await pb
				.collection(Collections.UserDetails)
				.getOne<UserDetailsResponse>(user.user_details);

			return { user: locals.user, avatar: await getAvatarUri(user), userDetails };
		} catch (_) {
			return { user: locals.user, avatar: await getAvatarUri(user) };
		}
	}
	try {
		const userDetails = await pb
			.collection(Collections.UserDetails)
			.getFirstListItem<UserDetailsResponse>(pb.filter('user = {:userId}', { userId: user.id }), {
				requestKey: 'fetchUserDetails'
			});

		await pb.collection(Collections.Users).update(user.id, {
			user_details: userDetails.id
		});

		return { user: locals.user, avatar: await getAvatarUri(user), userDetails };
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

				return { user: locals.user, userDetails: newUserDetails, avatar: await getAvatarUri(user) };
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (_) {
				return { user: locals.user, avatar: await getAvatarUri(user) };
			}
		}
		return { user: locals.user, avatar: await getAvatarUri(user) };
	}
}) satisfies LayoutServerLoad;
