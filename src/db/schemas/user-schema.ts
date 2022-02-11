import { Schema } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

export const UserSchema = new Schema(
  {
	username: { type: String, required: true, unique: true },
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	password: { type: String, required: true },
	salt: { type: String },
	role: {
		type: String,
		default: 'user',
		enum: ['user', 'moderator', 'admin'],
	},
  },
  { timestamps: true },
);

UserSchema.plugin(softDeletePlugin);
