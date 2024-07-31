// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { Schema } from '$lib/pocketbase/PB-Schema';
import type { UsersRecord } from '$lib/types/pbTypes';
import type { AuthModel } from 'pocketbase';
import type { TypedPocketBase } from 'typed-pocketbase';
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: TypedPocketBase<Schema>;
			user: AuthModel<UsersRecord> | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}
