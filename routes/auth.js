const { Router } = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const router = Router();

module.exports = () => {
	router.get(
		'/google',
		passport.authenticate('google', {
			scope: ['email', 'profile'],
			session: false,
		})
	);

	router.get(
		'/google/callback',
		passport.authenticate('google', {
			successRedirect: '/',
			failureRedirect: '/login',
		})
	);

	router.post('/login', async (req, res) => {
		const { email, password } = req.body;

		try {
			const user = await User.findOne({ email });

			if (!user) {
				return res.status(403).json({ error: 'Unauthorized' });
			}

			const token = jwt.sign(
				{ id: user.id, audience: 'elevated_user' },
				process.env.JWT_SECRET,
				{
					expiresIn: '1 hour',
				}
			);

			return res.json({ token });
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	});

	router.post('/register', async (req, res) => {
		const { email, password, name } = req.body;
		if (!email || !password || !name) {
			return res
				.status(401)
				.json({ error: 'Email, name, and password are required' });
		}
		try {
			const user = await User.findOne({ email });

			if (user) {
				return res.status(403).json({ error: 'User already exists' });
			}

			const hash = await bcrypt.hash(password, 10);

			const newUser = new User({
				name,
				email,
				password: hash,
			});

			await newUser.save();

			const token = jwt.sign(
				{ id: newUser.id, audience: 'elevated_user' },
				process.env.JWT_SECRET,
				{
					expiresIn: '1 hour',
				}
			);

			return res.json({
				status: 'success',
				message: 'Registration successful. Please login',
				data: token,
			});
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	});

	return router;
};
