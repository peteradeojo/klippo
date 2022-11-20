import express from 'express';
import { AuthenticatedUser, IUser } from '../models/User';

const router = express.Router();

export default () => {
	router.get('/', async (req, res) => {
		const user = req.user as AuthenticatedUser;
		res.send('Hello World');
	});

	return router;
};
