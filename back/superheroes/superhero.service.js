const jwtConfig = require('../_helpers/jwt.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const Superhero = db.Superhero;
const SuperheroLike = db.SuperheroLike;

module.exports = {
	getAll,
	getById,
	getByName,
	getLike,
	doLike,
	create,
	update,
	delete: _delete
};

async function getAll() {
	return await Superhero.find();
}

async function getById(id) {
	return await Superhero.findOne({ id: id });
}

async function getByName(name) {
	const nameRE = new RegExp(name, 'i');

	return await Superhero.find({ name: nameRE });
}

async function getLike(token, id) {
	let jwtToken = token.replace('Bearer ', '');
	let decoded = jwt.verify(jwtToken, jwtConfig.secret);
	let user = decoded.hey;

	const superheroLike = await SuperheroLike.findOne({user: user, superhero: id})
	if (superheroLike) {
		return { response: 'success', user: user, superhero: id, like: true, id: superheroLike.id };
	} else {
		return { response: 'success', user: user, superhero: id, like: false };
	}

}

async function doLike(token, id) {
	let jwtToken = token.replace('Bearer ', '');
	let decoded = jwt.verify(jwtToken, jwtConfig.secret);
	let user = decoded.hey;

	let like = await SuperheroLike.findOne({user: user, superhero: id});
	if (like != null) {
		await SuperheroLike.findOneAndDelete({user: user, superhero: id});

		let returnable = { response: 'success', user: user, superhero: id, like: false };

		return returnable;
	} else {
		const superheroLike = new SuperheroLike({user: user, superhero: id, like: true});
		await superheroLike.save();

		let returnable = { response: 'success', user: user, superhero: id, like: true, id: superheroLike.id };

		return returnable;
	}
}

async function create(superheroParam) {
	const superhero = new Superhero(superheroParam);

	await superhero.save();
}

async function update(id, superheroParam) {
	const superhero = await Superhero.findOne({ id: id });

	if (!superhero) throw 'Superhero not found';

	Object.assign(superhero, superheroParam);

	await superhero.save();
}

async function _delete(id) {
	await Superhero.findOneAndDelete({ id: id });
}
