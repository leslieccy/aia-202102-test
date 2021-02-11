import config from 'config';
import React from 'react';
import ReactDOM from 'react-dom';
import { authHeader, handleResponse } from '@/_helpers';
import { Route, Redirect, Link } from 'react-router-dom';

import { userService, superheroService, authenticationService } from '@/_services';

class Superheroes extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			search: '',
			superheroes: null
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({search: event.target.value});
	}

	handleSubmit(event) {
		superheroService.search(this.state.search).then(superheroes => this.setState({ superheroes }));
		event.preventDefault();
	}

	componentDidMount() {
	}

	render() {
		const { superheroes, search } = this.state;
		return (
			<div>
				<h2>Find the superheroes</h2>
				<form className="form-inline" onSubmit={this.handleSubmit}>
					<input type="text" className="form-control mb-2 mr-sm-2" placeholder="Superhero name" value={this.state.search} onChange={this.handleChange} />
					<button type="submit" className="btn btn-primary mb-2">Search</button>
				</form>
				<div className="row">
					<div className="col-12">
						<SuperheroesList superheroes={superheroes} />
					</div>
				</div>
			</div>
		);
	}
}

class SuperheroesList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			superheroes: this.props.superheroes,
			search: null
		};
	}

	shouldComponentUpdate(nextProps, nextState){
		if (nextProps.superheroes !== this.state.superheroes) {
			return true;
		}
		return false;
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.superheroes !== this.props.superheroes) {
			this.setState({superheroes: this.props.superheroes});
		}
	}

	componentDidMount() {
		// superheroService.getAll().then(superheroes => this.setState({ superheroes }));
	}

	render() {
		const { superheroes, search } = this.state;
		return (
			<div>
			{superheroes &&
				<div className="row row-cols-1">
					{superheroes.map(superhero =>
						<SuperheroesListItem key={superhero.id} superhero={superhero} />
					)}
				</div>
			}
			</div>
		);
	}
}

class SuperheroesListItem extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			superhero: this.props.superhero,
			liked: false,
			details: false,
		};

		this.handleItemClick = this.handleItemClick.bind(this);
		this.handleItemOpenClick = this.handleItemOpenClick.bind(this);
	}

	componentDidMount() {
		this.fetchAPIGet();
	}

	fetchAPIGet() {
		let superheroId = this.state.superhero.id;
		fetch(`${config.apiUrl}/superheroes/like/${superheroId}`, {
			method: 'GET',
			headers: authHeader({'Content-Type': 'application/json'}),
		}).then(results => {
			return results.json();
		}).then(data => {
			this.setState({liked: data.like});
			return data;
		})
	}

	fetchAPIPut() {
		let superheroId = this.state.superhero.id;
		fetch(`${config.apiUrl}/superheroes/like/${superheroId}`, {
			method: 'PUT',
			headers: authHeader({'Content-Type': 'application/json'}),
		}).then(results => {
			return results.json();
		}).then(data => {
			this.setState({liked: data.like});
			return data;
		})
	}

	handleItemClick() {
		this.setState({liked: !this.state.liked});
		this.fetchAPIPut();
	}

	handleItemOpenClick() {
		this.setState({details: !this.state.details});
	}

	render() {
		const { superhero, liked, details } = this.state;
		let handleItemClick = this.handleItemClick;
		let handleItemOpenClick = this.handleItemOpenClick;

		let detail = '';

		if (details) {
			detail = (
				<div>
					{superhero.powerstats && <SuperheroesPowerStats powerstats={superhero.powerstats} />}
					{superhero.biography && <SuperheroesBiography biography={superhero.biography} />}
					{superhero.appearance && <SuperheroesAppearance appearance={superhero.appearance} />}
					{superhero.work && <SuperheroesWork work={superhero.work} />}
					{superhero.connections && <SuperheroesConnections connections={superhero.connections} />}
				</div>
			)
		}

		return (
			<div className="col mb-4">
				<div className="card h-100">
					<div className="row no-gutters">
						<div className="col-3">
							<img src={superhero.image.url} className="card-img-top" alt={superhero.name} />
						</div>
						<div className="col-9">
							<div className="card-body">
								<h3 className="card-title">{superhero.name} <button onClick={handleItemClick} className="btn btn-sm">{ liked ?
									<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAB9klEQVRoge2YwXHCMBBFv9IBLUAJcNUNSqAFKAFKCCWEEkIL3HwNLdACJTgjz3risZGQVruOM9Gb4WBh5H1eiZWEQqFQ+FMY7WDrCjsAMwAXY3Ef3CCEqkhd4R3AgS4fAFZaMm+DFiHqCvOOBCgrB63nqYl4gt6RoDgqIhTsbvCFXzAbrYyEglXJirjIi2y0hERZaGQkJkjxrIiKRGajRTQr0hlJCU40K2IiidloEcsKq7LXFdZU4Oadz5LaUrlR1b/S79z1PXUFEBSht7ylAJcZwXJppDpyF18/XhGS+Bo58FecjMXx2T2hObKdmARCcyokMkW888YrYixONDanxNNhFRQhNgDOg9bxcf9qG9Zk71JX+GDUCClaieDoiK4jvyQTJYHUgjiyTLQEOJV9JJkkCWQsUTRlkiWQc4pSV/ikoinNKlUCmQXRW5wyYfWbI7IctMjA6vd/i9DKWGtBydo1cjOicsiW0zdXRGtYOdaDlgimmBFwDiXGEHF78RMVOo3+G7giMel39WBvbFOl3T5ilbAlSB66ySIRaW8FFsb+BO5ORYzFHsAiQmiUjPge4obOsS/Qpyd0HdwQfoaXZBFjm4d310IP2oIuaHsc248T2tAutC/kfRE+uKvfWWf1ezY2aSI/hQ793Ny40csqFAqFwsQB8A1/m4Jgtg+xDwAAAABJRU5ErkJggg==" style={{width: '22px'}} />
									:
									<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACuklEQVRoge2Z35HaMBDG15k0QAukhLtXv+ESLiVwJfhKwCVACbkSwptfjxKgBChBmfV86yyWLRuhdSYz/mYY20JI+vnTn5WgRYsWLfqvlFk31tW0JaIVEX1mOV28DIlkCuJq2hFRiccbEb1awXzzUhLJ1bRWEARXSqv6zEBUo9mBd9xvAZhcJiBo7BaPVZbTAUBk5YqVI60bgGBVuJq4khyk64akW7ti4UifGyIzV5KCDLkhsnQltSMhN0QmriQDGXNDZOVK1MruatpggVurzwvS2I0f3o/uf8/AezyesOof1fPl0QggCIK3/IYGvqjGhvSR5cOOqLKvE8o6wT2B+/RyjIEA4muksiPeprxVruzo5eoRytdO8lXShsSL60ffdyEQ7r87ZXvbWL7P8ubeRK6+g+PrBvc8xnrb/N1L8cUFHQOzUHJlefPSWEdXtyCkJglPg7MW+rkUuMcAnVWA+C1u8Pgbqn8QBCqIWidmhelAcDcuQoN9aqEM4fDZeRkSi8eIq+mM+q4YM2nUgdkbQ1xNIFQlpjCzQKjKTGBmhVCVJoVJAREVNGZ5sweXGWTjZXhcOvQp1DpiCwJdOtdndOopdzYQsX9SbBVSx4GosZECJNWBm8DMB4LIVfp0KhApJxT9DirWkbayKQMT4caYpJxZQcT+IATvJF3dxEscbpQjQOJI1Cz4rCO93Yq7nqvpF4I+2RbvADQUeLZlxRxKPAty5wgAeIE8Y4tMmNUqRLArRNEeUKeLzgZyt9HhLqMAtuq79yxvFjjeR7yqLcF6ACh65urdNoYE28/IUqDSsjOLVUM7SvV3gwYQ196QfkD0YAqyQd8n1V3kvppygkJ/gfadwX1TW+vC+1FAsedaX8r+G97mIeZAAi+m7AD9fHQ3GAuyUl0jCqCnTDkpOU09Ulq0aNGiRf9WRPQH6fRbKkMOJpEAAAAASUVORK5CYII=" style={{width: '22px'}} />
								}</button></h3>
								<p className="card-text">{superhero.biography['full-name']}</p>
								{detail}
								<button onClick={handleItemOpenClick} className="btn btn-sm">{ details ? 'Read less' : 'Read more' }</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

class SuperheroesPowerStats extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			powerstats: this.props.powerstats
		};
	}

	render() {
		const { powerstats } = this.state;
		return (
			<div className="row">
				<div className="col">
					<h4>Power Stats</h4>
					{Object.keys(powerstats).map((keyName, i) => (powerstats[keyName] != 'null') ? (
						<div className="mb-2" key={keyName}>{keyName}: {powerstats[keyName]}</div>
					) : (<span />) )}
				</div>
			</div>
		);
	}
}

class SuperheroesBiography extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			biography: this.props.biography
		};
	}

	render() {
		const { biography } = this.state;
		return (
			<div className="row">
				<div className="col">
					<h4>Biography</h4>
					{Object.keys(biography).map((keyName, i) => (biography[keyName] != 'null') ? (
						<div className="mb-2" key={keyName}>{keyName}: {biography[keyName]}</div>
					) : (<span />) )}
				</div>
			</div>
		);
	}
}

class SuperheroesAppearance extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			appearance: this.props.appearance
		};
	}

	render() {
		const { appearance } = this.state;
		return (
			<div className="row">
				<div className="col">
					<h4>Appearance</h4>
					{Object.keys(appearance).map((keyName, i) => (appearance[keyName] != 'null') ? (
						<div className="mb-2" key={keyName}>{keyName}: {appearance[keyName]}</div>
					) : (<span />) )}
				</div>
			</div>
		);
	}
}

class SuperheroesWork extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			work: this.props.work
		};
	}

	render() {
		const { work } = this.state;
		return (
			<div className="row">
				<div className="col">
					<h4>Work</h4>
					{Object.keys(work).map((keyName, i) => (work[keyName] != 'null') ? (
						<div className="mb-2" key={keyName}>{keyName}: {work[keyName]}</div>
					) : (<span />) )}
				</div>
			</div>
		);
	}
}

class SuperheroesConnections extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			connections: this.props.connections
		};
	}

	render() {
		const { connections } = this.state;
		return (
			<div className="row">
				<div className="col">
					<h4>Connections</h4>
					{Object.keys(connections).map((keyName, i) => (connections[keyName] != 'null') ? (
						<div className="mb-2" key={keyName}>{keyName}: {connections[keyName]}</div>
					) : (<span />) )}
				</div>
			</div>
		);
	}
}

export { Superheroes, SuperheroesList, SuperheroesListItem };
