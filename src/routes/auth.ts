import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import AuthController from '../controllers/AuthController';
import { IUser } from '../models/User';

const router = express.Router();

export default function () {
	router.get(
		'/',
		passport.authenticate('jwt', { session: false }),
		AuthController.loadProfile
	);

	router.post(
		'/login',
		body('email').isEmail(),
		body('password').isLength({ min: 6 }),
		AuthController.login
	);

	router.post(
		'/register',

		body('email').trim().isEmail(),
		body('first_name').trim().isString().isLength({ min: 1 }),
		body('last_name').trim().isString().isLength({ min: 1 }),
		body('password').trim().isString().isLength({ min: 8 }),
		body('password_confirm')
			.trim()
			.custom((value, { req }) => {
				if (value !== req.body.password) {
					throw new Error('Password confirmation does not match password');
				}

				return true;
			}),

		AuthController.register
	);
	return router;
}
