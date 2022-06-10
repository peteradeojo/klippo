const mongoose = require('mongoose');

const { Schema } = mongoose;

const FileSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	link: {
		type: String,
		required: true,
	},
	fileType: String,
	size: {
		type: Number,
	},
});

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
	file: {
		type: FileSchema,
		required: false,
	},
});

module.exports = mongoose.model('entry', EntrySchema);
