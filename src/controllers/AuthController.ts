import Debug from 'debug';
import { IRouter, Request, RequestHandler, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import User, { IUser } from '../models/User';

const debug = Debug('app:auth-controller');

const AuthController = {
	// Login a user
	login: (req: Request, res: Response) => {
		passport.authenticate('local', (err, user, info) => {
			if (err || !user) {
				return res.status(400).json({
					message: info
						? info.message
						: err.message
						? err.message
						: 'Login failed',
					user,
				});
			}

			req.login(user, { session: false }, (err: unknown) => {
				if (err) {
					return res.send(err);
				}

				const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
					expiresIn: '3h',
				});

				return res.json({ user, token });
			});
		})(req, res);
	},

	// Register a user
	register: async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			email,
			first_name: firstName,
			last_name: lastName,
			password,
		} = req.body;

		if (await User.findOne({ email })) {
			return res.status(400).json({ message: 'User already exists' });
		}

		const user = new User({ email, firstName, lastName });

		await user.setPasswordHash(password);
		await user.save();

		req.login(user, { session: false }, (err) => {
			if (err) {
				return res.send(err.stack);
			}

			const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
				expiresIn: '3h',
			});

			delete user.passwordHash;

			return res.json({ user, token });
		});
	},

	loadProfile: (req: Request, res: Response) => {
		return res.json({ user: req.user });
	},
};

export default AuthController;
