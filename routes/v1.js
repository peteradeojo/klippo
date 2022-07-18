const router = require('express').Router();
const { Random } = require('random-js');
const EntryController = require('../controllers/EntryController');
const { validateApiToken } = require('../middleware/ApiMiddleware');

const Entry = require('../models/Entry');

module.exports = () => {
	router.get('/', validateApiToken, EntryController.getAllEntries);
	
	router.post('/', EntryController.createEntry); // create a new entry 
	
	router.get('/:code', EntryController.getEntry);

	return router;
};
