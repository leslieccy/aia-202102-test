import React from 'react';
import { Router, Route, Link } from 'react-router-dom';

import { history } from '@/_helpers';
import { authenticationService } from '@/_services';
import { PrivateRoute } from '@/_components';
import { HomePage } from '@/HomePage';
import { LoginPage } from '@/LoginPage';
import { RegisterPage } from '@/RegisterPage';
import { ProfilePage } from '@/ProfilePage';
import { PasswordPage } from '@/PasswordPage';
import { Superheroes } from '@/Superheroes';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			currentUser: null
		};
	}

	componentDidMount() {
		authenticationService.currentUser.subscribe(x => this.setState({ currentUser: x }));
	}

	logout() {
		authenticationService.logout();
		history.push('/login');
	}

	render() {
		const { currentUser } = this.state;
		return (
			<Router history={history}>
				<div>
					{currentUser &&
						<nav className="navbar navbar-expand navbar-dark bg-dark">
							<div className="navbar-nav">
								<Link to="/" className="nav-item nav-link">Home</Link>
								<Link to="/profile" className="nav-item nav-link">Profile</Link>
								<Link to="/password" className="nav-item nav-link">Change Password</Link>
								<a onClick={this.logout} className="nav-item nav-link">Logout</a>
							</div>
						</nav>
					}
					<div className="jumbotron">
						<div className="container">
							<div className="row">
								<div className="col-md-8 offset-md-2">
									<PrivateRoute exact path="/" component={HomePage} />
									<Route path="/login" component={LoginPage} />
									<Route path="/register" component={RegisterPage} />
									<PrivateRoute exact path="/password" component={PasswordPage} />
									<PrivateRoute exact path="/profile" component={ProfilePage} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</Router>
		);
	}
}

export { App };
