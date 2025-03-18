import { sequence } from '@sveltejs/kit/hooks';
// import * as Sentry from '@sentry/sveltekit';
import { browser, dev } from '$app/environment';
import { env as envPublic } from '$env/dynamic/public';
import { redirect, type HandleServerError } from '@sveltejs/kit';
import Pocketbase from 'pocketbase';
import crypto from 'crypto';
import type { TypedPocketBase } from '$lib/types/pocketbase-types';

// Sentry.init({
// 	environment: dev ? 'development' : 'production',
// 	dsn: envPublic.PUBLIC_GLITCHTOP_DSN,
// 	tracesSampleRate: 1
// });

const errorId = crypto.randomUUID();

// Sentry.setTag('custom_error_id', errorId);

export const handleError: HandleServerError = ({ error, event }) => {
	console.error('Server side error:', error, event);

	return {
		message: "An unexpected error occurred. We're working on it!",
		errorId
	};
};

// export const handleError: HandleServerError = Sentry.handleErrorWithSentry(customErrorHandler);

export const handle = sequence(
	// Sentry.sentryHandle({ handleUnknownRoutes: false }),
	async function _handle({ event, resolve }) {
		// pb logic
		const { locals, request, url } = event;

		locals.pb = new Pocketbase(
			dev ? envPublic.PUBLIC_DEV_POCKETBASE_URL : envPublic.PUBLIC_POCKETBASE_URL
		) as TypedPocketBase;

		// load the store data from the request cookie string
		locals.pb.authStore.loadFromCookie(request.headers.get('cookie') || '');

		try {
			// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
			if (locals.pb.authStore.isValid) {
				await locals.pb.collection('users').authRefresh();
			}

			locals.user = locals.pb.authStore.record;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (_) {
			// clear the auth store on failed refresh
			locals.pb.authStore.clear();
			locals.user = null;
		}

		if (locals.user === null && url.pathname.startsWith('/api')) {
			if (!browser) {
				return await resolve(event);
			}
		}

		if (
			url.pathname.startsWith('/') &&
			locals.user === null &&
			!['/login', '/register', '/reset-password', '/reset-password/success'].includes(url.pathname)
		) {
			return redirect(303, '/login');
		}

		if (url.pathname === '/') {
			return redirect(303, '/dashboard');
		}

		if ((url.pathname === '/settings/' || url.pathname === '/settings') && locals.user) {
			return redirect(303, '/settings/account');
		}

		if (
			url.pathname.startsWith('/') &&
			locals.user &&
			['/login', '/register', '/reset-password', '/reset-password/success'].includes(url.pathname)
		) {
			return redirect(303, '/dashboard');
		}

		const response = await resolve(event);

		// send back the default 'pb_auth' cookie to the client with the latest store state
		response.headers.append(
			'set-cookie',
			locals.pb.authStore.exportToCookie({
				httpOnly: true
			})
		);

		return response;
	}
);
