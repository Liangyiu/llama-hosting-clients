export function getClientTrueIp(request: Request, eventIp: string) {
	return (
		request.headers.get('CF-Connecting-IP') ||
		request.headers.get('X-Forwarded-For') ||
		request.headers.get('X-Real-IP') ||
		eventIp
	);
}

const privateIpPattern =
	/^(?:10\.(?:(?:25[0-5]|2[0-4][0-9]|[1]?[0-9][0-9]?)\.){2}(?:25[0-5]|2[0-4][0-9]|[1]?[0-9][0-9]?)$)|(?:172\.(?:1[6-9]|2[0-9]|3[0-1])\.(?:(?:25[0-5]|2[0-4][0-9]|[1]?[0-9][0-9]?)\.){1}(?:25[0-5]|2[0-4][0-9]|[1]?[0-9][0-9]?)$)|(?:192\.168\.(?:(?:25[0-5]|2[0-4][0-9]|[1]?[0-9][0-9]?)\.){1}(?:25[0-5]|2[0-4][0-9]|[1]?[0-9][0-9]?)$)/;

export function isPrivateIp(ip: string) {
	return privateIpPattern.test(ip);
}
