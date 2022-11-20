import Debug from 'debug';
import express from 'express';
import fileupload from 'express-fileupload';
import path from 'path';

const debug = Debug('app');

const app = express();

if (app.get('env') !== 'production') {
	app.use(require('morgan')('dev'));
	require('dotenv').config();
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, '../views'));

import DB from './config/db';
import passport from './config/passport';
import AuthRouter from './routes/auth';
import HistoryRouter from './routes/history';
import IndexRouter from './routes/index';

app.use(
	fileupload({
		limits: { fileSize: 50 * 1024 * 1024 },
		useTempFiles: true,
		tempFileDir: path.resolve(__dirname, '../tmp'),
	})
);

app.use('/js', express.static(path.resolve(__dirname, '../public/dist/js')));
app.use('/img', express.static(path.resolve(__dirname, '../public/img/')));
app.use('/css', express.static(path.resolve(__dirname, '../public/dist/css')));

(async () => {
	await DB();
	app.use(passport.initialize());

	app.use(
		'/history',
		passport.authenticate('jwt', { session: false }),
		HistoryRouter()
	);
	app.use('/', IndexRouter());
	app.use('/auth', AuthRouter());

	const port: string | number = process.env.PORT || 3000;
	app.listen(port, () => {
		debug(`Server is running on port ${port}`);
	});
})();
