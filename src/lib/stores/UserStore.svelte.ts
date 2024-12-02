import { getContext, setContext } from 'svelte';

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
	defaultSshKeys?: string[];
	phoneNumber?: string;
	user: string;
	vatId?: string;
	avatarUrl?: string;
	balance?: number;
	mfaTotp: boolean;
	mfaTotpSecretId?: string;
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
