const User = require('../models/User');

module.exports = {
	getProfile: async (req, res, next) => {
		return res.json(req.user);
	},
};
