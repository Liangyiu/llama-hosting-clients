import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { env as envPublic } from '$env/dynamic/public';
import { type TypedPocketBase } from '$lib/types/pocketbase-types';
import Pocketbase from 'pocketbase';

const pbAdmin = new Pocketbase(
	dev ? envPublic.PUBLIC_DEV_POCKETBASE_URL : envPublic.PUBLIC_POCKETBASE_URL
) as TypedPocketBase;

pbAdmin.authStore.save(env.PB_ADMIN_TOKEN || '');
pbAdmin.autoCancellation(false);

export default pbAdmin;
