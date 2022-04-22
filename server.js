const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const debug = require('debug')('app:server');

const app = express();

if (app.get('env') !== 'production') {
	const dotenv = require('dotenv');
	dotenv.config();
	app.use(require('morgan')('dev'));
}

(async () => {
	try {
		const {
			connection: { host, port },
		} = await mongoose.connect(process.env.MONGO_URI);
		debug(`MongoDB connected on ${host}:${port}`);
	} catch (error) {
		debug(error);
		process.exit(1);
	}
})();

app.set('view engine', 'pug');

app.disable('x-powered-by');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index.js')());
app.use('/api', require('./routes/api.js')());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => debug(`Server running on port ${PORT}`));
