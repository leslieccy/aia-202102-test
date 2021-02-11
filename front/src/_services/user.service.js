import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';
import { authenticationService } from '@/_services';

export const userService = {
	getAll,
	getLikes,
	update
};

function getAll() {
	const requestOptions = { method: 'GET', headers: authHeader() };
	return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

function getLikes() {
	const requestOptions = { method: 'GET', headers: authHeader() };
	return fetch(`${config.apiUrl}/users/likes`, requestOptions).then(handleResponse);
}

function update(password) {
	const requestOptions = {
		method: 'PUT',
		headers: authHeader({'Content-Type': 'application/json'}),
		body: JSON.stringify({ password })
	};

	let currentUser = authenticationService.currentUserValue;

	return fetch(`${config.apiUrl}/users/${currentUser.id}`, requestOptions)
		.then(handleResponse)
		.then(() => {
			authenticationService.login(currentUser.username, password);
		});
}
