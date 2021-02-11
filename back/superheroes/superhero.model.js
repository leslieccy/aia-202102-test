const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const superheroSchema = new Schema({
	id: { type: String, required: true },
	name: { type: String, required: true },
	powerstats: {
		intelligence: { type: String },
		strength: { type: String },
		speed: { type: String },
		durability: { type: String },
		power: { type: String },
		combat: { type: String }
	},
	biography: {
		"full-name": { type: String },
		"alter-egos": { type: String },
		aliases: [String],
		"place-of-birth": { type: String },
		"first-appearance": { type: String },
		publisher: { type: String },
		alignment: { type: String }
	},
	appearance: {
		gender: { type: String },
		race: { type: String },
		height: [String],
		weight: [String],
		"eye-color": { type: String },
		"hair-color": { type: String }
	},
	work: {
		occupation: { type: String },
		base: { type: String }
	},
	connections: {
		"group-affiliation": { type: String },
		relatives: { type: String }
	},
	image: {
		url: { type: String }
	},
	createdDate: { type: Date, default: Date.now }
});

superheroSchema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: function (doc, ret) {
		delete ret._id;
		delete ret.createdDate;
	}
});

module.exports = mongoose.model('Superhero', superheroSchema);
