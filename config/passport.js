const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');
const { decode, sign, verify } = require('jsonwebtoken');
const User = require('../models/User');
const debug = require('debug')('app:passport');

module.exports = (passport) => {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: process.env.GOOGLE_CALLBACK_URL,
			},
			async (accessToken, refreshToken, profile, done) => {
				const { _json: data } = profile;
				try {
					let user = await User.findOne({ email: data.email });
					debug(data);
					if (user) {
						debug(user);
						return done(null, user);
					}

					user = new User({
						profileId: data.sub,
						provider: 'google',
						name: data.displayName,
						photoURL: data.picture,
						email: data.email,
					});

					await user.save();
					return done(null, user);
					
				} catch (err) {
					return done(err, false);
				}
			}
		)
	);

	passport.use(
		new JWTStrategy(
			{
				secretOrKey: process.env.JWT_SECRET,
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			},
			async (jwtPayload, done) => {
				try {
					const user = await User.findById(jwtPayload.id);
					if (user) {
						return done(null, user, jwtPayload);
					}
					return done(null, false);
				} catch (err) {
					return done(err, false);
				}
			}
		)
	);

	// passport.serializeUser(async (user, done) => {
	// 	return done(null, user.id);
	// });

	// passport.deserializeUser(async (id, done) => {
	// 	try {
	// 		const user = await User.findById(id);
	// 		return done(null, user);
	// 	} catch (err) {
	// 		return done(err, false);
	// 	}
	// });
};
