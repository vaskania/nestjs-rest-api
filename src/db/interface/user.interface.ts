import mongoose from 'mongoose';

export interface User extends Document {
  readonly _id: mongoose.Schema.Types.ObjectId;
  readonly username: string;
  readonly firstname: string;
  readonly lastname: string;
  readonly password?: string;
  readonly salt?: string;
  readonly deletedAt?: Date;
  readonly isDeleted?: boolean;
}
