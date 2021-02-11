var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cors = require('cors');
const jwt = require('./_helpers/jwt');
var db = require('./_helpers/db');

var indexRouter = require('./routes/index');
var superheroesRouter = require('./superheroes/superheroes.controller');
var usersRouter = require('./users/users.controller');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(jwt());
app.use(cors());
app.options('*', cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/superheroes', superheroesRouter);
app.use('/users', usersRouter);

app.use(function(req, res, next) {
	next(createError(404));
});

app.use(function(err, req, res, next) {
	if (typeof (err) === 'string') {
		return res.status(400).json({ message: err });
	}

	if (err.name === 'ValidationError') {
		return res.status(400).json({ message: err.message });
	}

	if (err.name === 'UnauthorizedError') {
		return res.status(401).json({ message: 'Invalid Token' });
	}

	return res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
