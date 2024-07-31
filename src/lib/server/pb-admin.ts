import { dev } from '$app/environment';
import { SECRET_POCKETBASE_EMAIL, SECRET_POCKETBASE_PW } from '$env/static/private';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import type { Schema } from '$lib/pocketbase/PB-Schema';
import { TypedPocketBase } from 'typed-pocketbase';

export const pbAdmin = new TypedPocketBase<Schema>(
	dev ? 'http://127.0.0.1:8090' : PUBLIC_POCKETBASE_URL
);

pbAdmin.autoCancellation(false);

// the credentials can be filled via env variables

await pbAdmin.admins.authWithPassword(SECRET_POCKETBASE_EMAIL, SECRET_POCKETBASE_PW, {
	// This will trigger auto refresh or auto reauthentication in case
	// the token has expired or is going to expire in the next 30 minutes.
	autoRefreshThreshold: 30 * 60
});
