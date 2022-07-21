const router = require('express').Router();

const EntryController = require('../controllers/EntryController');

module.exports = () => {
	router.get('/', (req, res) => {
		res.redirect(process.env.SPA_URL ?? '/');
	});

	router.post('/', EntryController.createEntry); // create a new entry

	router.get('/:code', EntryController.getEntry);

	return router;
};
