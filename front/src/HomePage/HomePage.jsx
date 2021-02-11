import React from 'react';
import { Superheroes } from '@/Superheroes';
import { authenticationService } from '@/_services';

class HomePage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			currentUser: authenticationService.currentUserValue,
			users: null,
			superheroes: null,
			likes: null
		};
	}

	render() {
		const { currentUser } = this.state;
		return (
			<div>
				<h1>Hello, {currentUser.firstName}!</h1>
				<p>Welcome back.</p>
				<Superheroes />
			</div>
		);
	}
}

export { HomePage };
