import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface IClip {
	content: string;
	title: string;
	user_id: unknown;
	fileLink?: string;
	accessCode: string;
	createdAt: Date;
}

const clipSchema = new Schema<IClip>(
	{
		content: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		user_id: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		fileLink: {
			type: String,
		},
		accessCode: {
			type: String,
			required: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model<IClip>('Clip', clipSchema);
