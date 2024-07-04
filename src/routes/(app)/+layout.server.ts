import { type UserDetailsRecord, type UserDetailsResponse } from '$lib/types/pbTypes';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const { user, pb } = locals;
	try {
		const userDetails = await pb
			.collection('user_details')
			.getFirstListItem<
				UserDetailsResponse<UserDetailsRecord>
			>('user="' + user?.id + '"', { requestKey: 'fetchUserDetails' });
		const avatarUrl = await pb.getFileUrl(userDetails, userDetails.avatar, { thumb: '200x200' });

		return { user: locals.user, avatarUrl, userDetails };
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (_) {
		return { user: locals.user, avatarUrl: '' };
	}
}) satisfies LayoutServerLoad;
