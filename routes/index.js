const router = require('express').Router();

module.exports = () => {
	router.get('/', (req, res) => {
		res.redirect(process.env.SPA_URL ?? '/');
	});

	router.get('/login', (req, res) => {
		return res.render('login');
	});

	router.get('/register', (req, res) => {
		return res.render('register');
	});

	return router;
};
