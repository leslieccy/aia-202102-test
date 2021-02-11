import { authenticationService } from '@/_services';

export function authHeader(headers) {
	const currentUser = authenticationService.currentUserValue;
	if (currentUser && currentUser.token) {
		return {Authorization: `Bearer ${currentUser.token}`, ...headers};
	} else {
		return {};
	}
}
