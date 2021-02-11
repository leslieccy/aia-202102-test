const expressJwt = require('express-jwt');
const jwtConfig = require('./jwt.json');
const userService = require('../users/user.service');

module.exports = jwt;

function jwt() {
	const secret = jwtConfig.secret;
	return expressJwt({ secret, algorithms: ['HS256'], isRevoked }).unless({
		path: [
			'/users/authenticate',
			'/users/register',
			/\/superheroes/i
		]
	});
}

async function isRevoked(req, payload, done) {
	const user = await userService.getById(payload.hey);

	if (!user) {
		return done(null, true);
	}

	done();
};
