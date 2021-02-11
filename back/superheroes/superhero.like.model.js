const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const superheroLikeSchema = new Schema({
	user: { type: String, required: true },
	superhero: { type: String, required: true },
	createdDate: { type: Date, default: Date.now }
});

superheroLikeSchema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: function (doc, ret) {
		delete ret._id;
		delete ret.createdDate;
	}
});

module.exports = mongoose.model('SuperheroLike', superheroLikeSchema);
