const router = require('express').Router();
const { Random } = require('random-js');
const EntryController = require('../controllers/EntryController');
const debug = require('debug')('app:api');

const Entry = require('../models/Entry');

module.exports = () => {
	router.get('/', EntryController.getAllEntries);

	router.post('/', EntryController.createEntry);

	// router.post('/', async (req, res) => {
	// 	const { text } = req.body;
	// 	debug(text);
	// 	try {
	// 		const random = new Random();
	// 		const value = random.integer(999, 10000);
	// 		let entry = await Entry.findOne({ code: value });
	// 		if (entry) {
	// 			entry.text = text;
	// 		} else {
	// 			entry = new Entry({ text, code: value });
	// 		}
	// 		debug(entry);
	// 		await entry.save();
	// 		res.json({
	// 			code: value,
	// 		});
	// 	} catch (error) {
	// 		debug(error);
	// 		res.status(500).send(error);
	// 	}
	// });

	router.get('/:code', EntryController.getEntry);

	return router;
};
