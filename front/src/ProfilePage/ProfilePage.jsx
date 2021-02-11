import React from 'react';
import { SuperheroesList } from '@/Superheroes';
import { userService, superheroService, authenticationService } from '@/_services';

class ProfilePage extends React.Component {
	constructor(props) {
		super(props);

		if (!authenticationService.currentUserValue) {
			this.props.history.push('/login');
		}

		this.state = {
			currentUser: authenticationService.currentUserValue,
			users: null,
			superheroes: [],
			likes: null
		};
	}

	componentDidMount() {
		userService.getLikes()
			.then(likes => this.setState({ likes }))
			.then(() => {
					let { likes } = this.state;
					likes.map(liked => {
						superheroService.getById(liked.superhero)
							.then(superhero => {
								this.setState({ superheroes: [...this.state.superheroes, superhero] })
							})
					})
				});
	}

	render() {
		const { currentUser, superheroes, likes } = this.state;
		return (
			<div>
				<h1>Hey {currentUser.firstName}, you like...</h1>
				{superheroes &&
					<SuperheroesList superheroes={superheroes} />
				}
			</div>
		);
	}
}

export { ProfilePage };
