import { initials } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';

function getInitials(firstName: string, lastName: string) {
	return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
}

export function getAvatarUri(first_name: string, last_name: string) {
	return createAvatar(initials, {
		backgroundType: ['gradientLinear'],
		backgroundColor: ['b347fd', '6553a8'],
		backgroundRotation: [240, 360],
		textColor: ['ededed'],
		seed: getInitials(first_name, last_name)
	}).toDataUri();
}
