import type { PageLoad } from './$types';

export const load = (async () => {
	return {
		extra: {
			crumbs: [
				{
					title: 'Dashboard',
					url: '/dashboard'
				}
			]
		}
	};
}) satisfies PageLoad;
