import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { browser, dev } from '$app/environment';
import {
	PUBLIC_GLITCHTOP_DSN_DEV,
	PUBLIC_GLITCHTOP_DSN_PROD,
	PUBLIC_POCKETBASE_URL
} from '$env/static/public';
import { TypedPocketBase } from 'typed-pocketbase';
import { redirect, type HandleServerError } from '@sveltejs/kit';
import type { Schema } from '$lib/pocketbase/PB-Schema';
import crypto from 'crypto';

Sentry.init({
	dsn: dev ? PUBLIC_GLITCHTOP_DSN_DEV : PUBLIC_GLITCHTOP_DSN_PROD,
	tracesSampleRate: 1
});

export const handleError: HandleServerError = ({ error, event }) => {
	const errorId = crypto.randomUUID();

	Sentry.captureException(error, {
		contexts: {
			sveltekit: {
				errorId,
				event
			}
		}
	});

	return {
		message: "An unexpected error occurred. We're working on it!",
		errorId
	};
};

export const handle = sequence(Sentry.sentryHandle(), async function _handle({ event, resolve }) {
	// theme logic
	let theme = '';

	const cookieTheme = event.cookies.get('theme');

	if (cookieTheme) {
		theme = cookieTheme;
	} else {
		// set default theme, cookie expiry in 1 year
		event.cookies.set('theme', 'skeleton', { path: '/', maxAge: 60 * 60 * 24 * 30 * 12 });
		theme = 'skeleton';
	}

	// pb logic
	const { locals, request, url } = event;

	locals.pb = new TypedPocketBase<Schema>(dev ? 'http://127.0.0.1:8090' : PUBLIC_POCKETBASE_URL);

	// load the store data from the request cookie string
	locals.pb.authStore.loadFromCookie(request.headers.get('cookie') || '');

	try {
		// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
		if (locals.pb.authStore.isValid) {
			await locals.pb.collection('users').authRefresh();
		}
		locals.user = locals.pb.authStore.model;
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

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('data-theme=""', `data-theme="${theme}"`)
	});

	// send back the default 'pb_auth' cookie to the client with the latest store state
	response.headers.append('set-cookie', locals.pb.authStore.exportToCookie());

	return response;
});
