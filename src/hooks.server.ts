import { dev } from '$app/environment';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { TypedPocketBase } from 'typed-pocketbase';
import { redirect } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import type { Schema } from '$lib/pocketbase/PB-Schema';

export async function handle({ event, resolve }) {
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

	if (
		url.pathname.startsWith('/') &&
		locals.user === null &&
		!['/login', '/register', '/reset-password', '/reset-password/success'].includes(url.pathname)
	) {
		return redirect(303, '/login');
	}

	if (
		url.pathname.startsWith('/') &&
		locals.user &&
		['/', '/login', '/register', '/reset-password', '/reset-password/success'].includes(
			url.pathname
		)
	) {
		return redirect(303, '/dashboard');
	}

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('data-theme=""', `data-theme="${theme}"`)
	});

	// send back the default 'pb_auth' cookie to the client with the latest store state
	response.headers.append('set-cookie', locals.pb.authStore.exportToCookie());

	return response;
}
