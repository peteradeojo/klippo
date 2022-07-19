const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const debug = require('debug')('app:server');
const fileUpload = require('express-fileupload');
const passport = require('passport');

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

app.disable('x-powered-by');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	fileUpload({
		limits: { fileSize: 20 * 1000 * 1000 },
		useTempFiles: true,
		createParentPath: true,
	})
);

app.use(express.static(path.join(__dirname, 'public')));

require('./config/passport')(passport);
app.use(passport.initialize());

app.use('/', require('./routes/index.js')());
app.use('/v1', require('./routes/v1.js')());
app.use('/api', require('./routes/api.js')());
app.use('/auth', require('./routes/auth.js')());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => debug(`Server running on port ${PORT}`));
