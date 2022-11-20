import debug from 'debug';
import passport from 'passport';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import User, { IUser } from '../models/User';

passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
			session: false,
		},
		async (email: string, password: string, done) => {
			try {
				const user = await User.findOne({ email });

				if (!user) {
					return done(null, false, { message: 'User not found' });
				}

				if (!user.comparePassword(password)) {
					return done(null, false, { message: 'Invalid password' });
				}

				return done(null, user);
			} catch (err) {
				return done(err, false, { message: err.message });
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
		async (payload, done) => {
			const user = await User.findById(payload._id, '-passwordHash');

			if (!user) {
				return done('User not found', false, { message: 'User not found' });
			}

			return done(null, user);
		}
	)
);

export default passport;
