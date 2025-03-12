import type { UsersRecord, UsersResponse } from "$lib/types/pocketbase-types";
import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

function getInitials(firstName: string, lastName: string){
	return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
}

export async function getAvatarUri(user: UsersResponse | UsersRecord){
    return await createAvatar(initials, {
		backgroundType: ['gradientLinear'],
		backgroundColor: ['b347fd', '6553a8'],
		backgroundRotation: [240, 360],
		textColor: ['ededed'],
		seed: getInitials(user.first_name, user.last_name)
	}).toDataUri();
}

