import type { PageLoad } from './$types';

export const load = (async () => {
	return {
		extra: {
			crumbs: [
				{
					title: 'Settings'
				},
				{
					title: 'Account',
					url: '/settings/account'
				}
			]
		}
	};
}) satisfies PageLoad;
