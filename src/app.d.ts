// See https://svelte.dev/docs/kit/types#app.d.ts

import type { TypedPocketBase } from '$lib/types/pocketbase-types';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: TypedPocketBase;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
