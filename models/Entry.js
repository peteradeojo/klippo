const mongoose = require('mongoose');

const { Schema } = mongoose;

const EntrySchema = new Schema({
	dateAdded: {
		type: Date,
		default: new Date(),
	},
	text: {
		type: String,
		required: true,
	},
	code: {
		type: Number,
		unique: true,
		required: true,
	},
});

module.exports = mongoose.model('entry', EntrySchema);
