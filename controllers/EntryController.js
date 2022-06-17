const cloudinary = require('cloudinary');
const debug = require('debug')('app:entrycontroller');
const { Random } = require('random-js');
const { v4 } = require('uuid');
const path = require('path');

const Entry = require('../models/Entry');

const EntryController = {
	getAllEntries: async (req, res) => {
		try {
			let { page, count } = req.query;
			page ||= 1;
			count ||= 10;

			const entries = await Entry.find()
				.skip(count * (page - 1))
				.limit(count);

			const data = {
				previous: page > 1 ? `/api/?page=${page - 1}&count=${count}` : null,
				data: entries,
				next: `/api/?page=${parseInt(page) + 1}&count=${count}`,
			};
			res.json(data);
		} catch (error) {
			res.status(500).json({ error: error.message || error.stack });
		}
	},

	getEntry: async (req, res) => {
		try {
			const { code } = req.params;
			// debug(code);
			const entry = await Entry.findOne({ code });
			if (!entry) {
				return res.status(404).json({ message: 'Not found' });
			}
			res.json(entry);
		} catch (error) {
			res.status(500).send(error);
		}
	},

	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @returns
	 */
	createEntry: async (req, res) => {
		try {
			const { text } = req.body;
			let code = new Random().integer(999, 10000);

			// if (!(await EntryController.validateCode(code))) {
			// 	return res
			// 		.status(500)
			// 		.json({ message: 'An error occured. Please try again' });
			// }

			const entry = new Entry({ code, text });
			const filetag = v4();

			if (req.files) {
				const file = req.files.file;
				const mediaTypes = [
					'.jpg',
					'.jpeg',
					'.png',
					'.mp4',
					'.mpeg',
					'.avi',
					'.mov',
					'.m4v',
					'.mpg',
					'.flv',
					'.wmv',
					'.3gp',
					'.3g2',
					'.mts',
					'.ts',
					'.mkv',
					'.webm',
					'.pdf',
				];

				if (!mediaTypes.includes(path.extname(file.name))) {
					return res
						.status(402)
						.json({ message: 'Invalid File type. Only media files allowed' });
				}
				const filePath = path.resolve(
					__dirname,
					'../uploads/',
					filetag + path.extname(file.name)
				);
				await file.mv(filePath);
				// debug('File moved. Uploading to cloudinary...');

				const { url } = await cloudinary.v2.uploader.upload(filePath, {
					api_key: process.env.CLOUDINARY_API_KEY,
					api_secret: process.env.CLOUDINARY_API_SECRET,
					cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
				});

				entry.file = {
					name: file.name,
					link: url,
					fileType: path.extname(file.name),
					size: file.size,
				};
				// await entry.save();
			}

			await entry.save();

			return res.json({
				code: entry.code,
				file: entry.file,
			});
		} catch (error) {
			debug(error);
			return res.status(500).json({ error: error.message });
		}
	},

	validateCode: async (code) => {
		try {
			const entry = await Entry.deleteMany({ code });
			return true;
		} catch (error) {
			debug(error);
			return false;
		}
	},
};

module.exports = EntryController;
