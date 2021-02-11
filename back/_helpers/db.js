const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/202102-aia-test', {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('mongo connected');
});

module.exports = {
	Superhero: require('../superheroes/superhero.model'),
	SuperheroLike: require('../superheroes/superhero.like.model'),
	User: require('../users/user.model')
};
