import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import type { TypedPocketBase } from '$lib/types/pbTypes';
import { redirect } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

export async function handle({ event, resolve }) {
	// theme logic
	let theme = '';

	const cookieTheme = event.cookies.get('theme');

	if (cookieTheme) {
		theme = cookieTheme;
	} else {
		event.cookies.set('theme', 'skeleton', { path: '/' });
		theme = 'skeleton';
	}

	// pb logic
	const { locals, request, url } = event;

	locals.pb = new PocketBase(PUBLIC_POCKETBASE_URL) as TypedPocketBase;

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
		url.pathname.startsWith('/clients') &&
		locals.user === null &&
		![
			'/clients/login',
			'/clients/register',
			'/clients/reset-password',
			'/clients/reset-password/success'
		].includes(url.pathname)
	) {
		return redirect(303, '/clients/login');
	}

	if (
		url.pathname.startsWith('/clients') &&
		locals.user &&
		[
			'/clients',
			'/clients/login',
			'/clients/register',
			'/clients/reset-password',
			'/clients/reset-password/success'
		].includes(url.pathname)
	) {
		return redirect(303, '/clients/dashboard');
	}

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('data-theme=""', `data-theme="${theme}"`)
	});

	// send back the default 'pb_auth' cookie to the client with the latest store state
	response.headers.append('set-cookie', locals.pb.authStore.exportToCookie());

	return response;
}
