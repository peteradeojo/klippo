const jwt = require('jsonwebtoken');
const debug = require('debug')('app:api');

const parseBearer = (string) => {
	return string.split('Bearer ')[1];
};

module.exports = {

	validateApiToken: function (req, res, next) {
		const { authorization } = req.headers;
		const token = parseBearer(authorization);

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

	generateAccessToken: (userId) => {
		const expiresIn = '1 hour';
		const audience = 'elevated_user';

		const token = jwt.sign({}, process.env.JWT_SECRET, {
			expiresIn,
		});
	},
};

// class ApiMiddleware {
// 	validateApiToken = function (req, res, next) {
// 		const { authorization } = req.headers;
// 		const token = this.parseBearer(authorization);

// 		if (!token) {
// 			return res.status(401).json({ message: 'Unauthorized' });
// 		}
// 		const decoded = jwt.verify(token, process.env.JWT_SECRET);
// 		if (!decoded) {
// 			return res.status(401).json({ message: 'Unauthorized' });
// 		}
// 		req.user = decoded;
// 		next();
// 	};

// 	parseBearer = function (string) {
// 		return string.split('Bearer ')[1];
// 	}
// }
