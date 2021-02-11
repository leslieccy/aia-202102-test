import { BehaviorSubject } from 'rxjs';

import config from 'config';
import { handleResponse } from '@/_helpers';

export const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
	register,
	login,
	logout,
	currentUser: currentUserSubject.asObservable(),
	get currentUserValue () { return currentUserSubject.value }
};

function register(username, firstName, lastName, password) {
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, firstName, lastName, password })
	};

	return fetch(`${config.apiUrl}/users/register`, requestOptions)
		.then(handleResponse)
		.then(user => {
			localStorage.setItem('currentUser', JSON.stringify(user));
			currentUserSubject.next(user);

			return user;
		});
}

function login(username, password) {
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, password })
	};

	return fetch(`${config.apiUrl}/users/authenticate`, requestOptions)
		.then(handleResponse)
		.then(user => {
			localStorage.setItem('currentUser', JSON.stringify(user));
			currentUserSubject.next(user);

			return user;
		});
}

function logout() {
	// remove user from local storage to log user out
	localStorage.removeItem('currentUser');
	currentUserSubject.next(null);
}
