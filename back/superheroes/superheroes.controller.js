const express = require('express');
const router = express.Router();
const superheroService = require('./superhero.service');

const fetch = require('node-fetch');

// routes
router.post('/create', create);
router.get('/', getAll);
router.get('/like/:id', getLike);
router.put('/like/:id', doLike);
router.get('/current', getCurrent);
router.get('/search/:name', getByName);
router.get('/import', importAPIAll);
router.get('/import/:id', importAPI);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function create(req, res, next) {
	superheroService.create(req.body)
		.then(() => res.json({}))
		.catch(err => next(err));
}

function getAll(req, res, next) {
	superheroService.getAll()
		.then(superheros => res.json(superheros))
		.catch(err => next(err));
}

async function importAPIAll(req, res, next) {
	console.log('/superheroes/importAPIAll');
	for (let i = 1; i < 733; i++) {
		await fetch('https://superheroapi.com/api/3943431355675109/' + i)
			.then(res => res.json())
			.then(json => {
				delete json.response;
				console.log('saving Superhero # ' + json.id + " : " + json.name);
				superheroService.create(json);
			});
	}

	res.json({"response": "success"});
}

async function importAPI(req, res, next) {
	console.log('/superheroes/import');
	fetch('https://superheroapi.com/api/3943431355675109/' + req.params.id)
		.then(res => res.json())
		.then(json => {
			delete json.response;
			superheroService.create(json);
			res.json(json);
		});
}


function getCurrent(req, res, next) {
	superheroService.getById(req.superhero.sub)
		.then(superhero => superhero ? res.json(superhero) : res.sendStatus(404))
		.catch(err => next(err));
}

function getById(req, res, next) {
	superheroService.getById(req.params.id)
		.then(superhero => superhero ? res.json(superhero) : res.sendStatus(404))
		.catch(err => next(err));
}

function getByName(req, res, next) {
	superheroService.getByName(req.params.name)
		.then(superhero => superhero ? res.json(superhero) : res.sendStatus(404))
		.catch(err => next(err));
}

function getLike(req, res, next) {
	superheroService.getLike(req.headers['authorization'], req.params.id)
		.then(superhero => superhero ? res.json(superhero) : res.sendStatus(404))
		.catch(err => next(err));
}

function doLike(req, res, next) {
	superheroService.doLike(req.headers['authorization'], req.params.id)
		.then(superhero => superhero ? res.json(superhero) : res.sendStatus(404))
		.catch(err => next(err));
}

function update(req, res, next) {
	superheroService.update(req.params.id, req.body)
		.then(() => res.json({}))
		.catch(err => next(err));
}

function _delete(req, res, next) {
	superheroService.delete(req.params.id)
		.then(() => res.json({}))
		.catch(err => next(err));
}
