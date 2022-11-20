import Debug from 'debug';
import mongoose from 'mongoose';

const debug = Debug('app:db');

export default async () => {
	try {
		const connection = await mongoose.connect(process.env.MONGO_URL);
		debug('Connected to MongoDB');
		return connection;
	} catch (error) {
		debug(error);
		process.exit(1);
	}
};
