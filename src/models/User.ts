import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import mongoose, { Document } from 'mongoose';

export interface IUser {
	email: string;
	firstName: string;
	lastName: string;
	passwordHash?: string;
	comparePassword?: (password: string) => boolean;
	setPasswordHash?: (password: string) => void;
}

export type AuthenticatedUser = IUser & Document<IUser>;

const { Schema } = mongoose;

const userSchema = new Schema<IUser>(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			length: 40,
		},
		passwordHash: {
			type: String,
			required: true,
		},
		firstName: String,
		lastName: String,
	},
	{
		timestamps: true,
	}
);

userSchema.methods.setPasswordHash = function (password: string): void {
	const hash = hashSync(
		password,
		genSaltSync((process.env.SALTROUNDS as unknown as number | undefined) || 10)
	);

	this.passwordHash = hash;
};

userSchema.methods.comparePassword = function (password: string): boolean {
	return compareSync(password, this.passwordHash);
};

userSchema.methods.toJSON = function () {
	const obj = this.toObject();
	delete obj.passwordHash;
	delete obj.__v;
	return obj;
};

export default mongoose.model<IUser>('User', userSchema);
