const router = require('express').Router();
const { Random } = require('random-js');
const EntryController = require('../controllers/EntryController');
const UserController = require('../controllers/UserController');
const { validateApiToken } = require('../middleware/ApiMiddleware');

const Entry = require('../models/Entry');

module.exports = () => {
	router.get('/', validateApiToken, EntryController.getAllEntries);
	router.get('/profile', validateApiToken, UserController.getProfile);

	return router;
};
