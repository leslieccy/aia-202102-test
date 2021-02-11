import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';
import { authenticationService } from '@/_services';

export const superheroService = {
	getAll,
	getById,
	search
};

function getAll() {
	const requestOptions = { method: 'GET' };
	return fetch(`${config.apiUrl}/superheroes`, requestOptions).then(handleResponse);
}

function getById(id) {
	const requestOptions = { method: 'GET' };
	return fetch(`${config.apiUrl}/superheroes/${id}`, requestOptions).then(handleResponse);
}

function search(name) {
	const requestOptions = {
		method: 'GET',
		headers: {'Content-Type': 'application/json'},
	};

	return fetch(`${config.apiUrl}/superheroes/search/${name}`, requestOptions)
		.then(handleResponse)
}
