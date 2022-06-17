const router = require('express').Router();
const { Random } = require('random-js');
const EntryController = require('../controllers/EntryController');
const debug = require('debug')('app:api');
const { validateApiToken } = require('../middleware/ApiMiddleware');

const Entry = require('../models/Entry');

module.exports = () => {
	router.get('/', validateApiToken, EntryController.getAllEntries);

	router.post('/', EntryController.createEntry);

	router.get('/:code', EntryController.getEntry);

	return router;
};
