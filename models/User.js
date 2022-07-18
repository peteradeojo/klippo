const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
	profileId: String,
	name: {
		type: String,
		required: true,
	},
	provider: {
		type: String,
		enum: ['google', 'local'],
		required: true,
		default: 'local',
	},
	photoURL: String,
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
	},
	refreshToken: String,
});

module.exports = mongoose.model('User', userSchema);
