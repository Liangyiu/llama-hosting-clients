import type { RecordIdString } from '$lib/types/pbTypes';
import { getContext, setContext } from 'svelte';
import { type Writable, writable } from 'svelte/store';

type UserData = {
	firstName: string;
	lastName: string;
	email: string;
	addressCity?: string;
	addressCountry?: string;
	addressLineOne?: string;
	addressLineTwo?: string;
	addressStateProvince?: string;
	addressPostalCode?: string;
	avatar?: string;
	defaultSshKeys?: RecordIdString[];
	phoneNumber?: string;
	user: RecordIdString;
	vatId?: string;
	avatarUrl?: string;
	balance?: number;
};

const USER_CTX = 'USER_CTX';

export function setUserState(initialData: UserData) {
	const userState = writable(initialData);
	setContext(USER_CTX, userState);
	return userState;
}

export function getUserState() {
	return getContext<Writable<UserData>>(USER_CTX);
}
