const jwt = require('jsonwebtoken');

module.exports = {
	validateApiToken: (req, res, next) => {
		const { token } = req.headers;
		if (!token) {
			return res.status(401).json({ message: 'Unauthorized' });
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded) {
			return res.status(401).json({ message: 'Unauthorized' });
		}
		req.user = decoded;
		next();
	},
};
