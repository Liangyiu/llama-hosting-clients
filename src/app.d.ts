// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { Schema, UsersResponse } from '$lib/pocketbase/PB-Schema';
import type { TypedPocketBase } from 'typed-pocketbase';

declare global {
	namespace App {
		interface Error {
			errorId: string;
		}
		interface Locals {
			pb: TypedPocketBase<Schema>;
			user: UsersResponse | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}
