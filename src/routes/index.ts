import Debug from 'debug';
import express from 'express';
import { body, validationResult } from 'express-validator';
import { Random } from 'random-js';
import Clip, { IClip } from '../models/Clip';
import { AuthenticatedUser } from '../models/User';

const debug = Debug('app:index-router');

const router = express.Router();

export default function Router() {
	router.get('/:code?', async (req, res) => {
		const { code } = req.params;
		if (code) {
			const clip = await Clip.findOne({ accessCode: code });
			if (clip) {
				return res.json({
					title: clip.title,
					content: clip.content,
					createdAt: clip.createdAt,
					code: clip.accessCode,
				});
			}

			return res.status(404).json({ error: 'Clip not found' });
		}

		return res.render('index');
	});

	router.post(
		'/',
		body('title').isString().isLength({ min: 1 }),
		body('content').notEmpty(),
		async (req, res) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			try {
				const user = req.user as AuthenticatedUser;

				const { content, title } = req.body;

				const code = new Random().integer(1000, 9999).toString();

				let clip = await Clip.findOne({
					accessCode: code,
				});

				if (clip) {
					clip.title = title;
					clip.content = content;
				} else {
					clip = new Clip({ content, title, accessCode: code });
				}

				if (user) {
					clip.user_id = user._id;
				}

				await clip.save();

				return res
					.status(201)
					.json({ data: clip, message: 'Clip submitted successfully' });
			} catch (err) {
				console.error(err);
				return res.status(500).json({ message: 'Internal Server Error' });
			}
		}
	);

	return router;
}
