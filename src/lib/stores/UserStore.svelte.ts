import { getContext, setContext } from 'svelte';

type UserData = {
	firstName?: string;
	lastName?: string;
	addressCity?: string;
	addressCountry?: string;
	addressLineOne?: string;
	addressLineTwo?: string;
	addressStateProvince?: string;
	addressPostalCode?: string;
	defaultSshKeys?: string[];
	phoneNumber?: string;
	userId?: string;
	vatId?: string;
	balance?: number;
	email?: string;
	avatar?: string;
};

const USER_CTX = 'USER_CTX';

export function setUserState(initialData: UserData) {
	const userState = $state(initialData);
	setContext(USER_CTX, userState);
	return userState;
}

export function getUserState() {
	return getContext<UserData>(USER_CTX);
}
