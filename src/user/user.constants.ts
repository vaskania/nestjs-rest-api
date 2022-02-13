export const UserNotFoundError = 'User not found';

export const UserAlreadyExists = 'User already exist';

export type ResponseObject = {
  username: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
  salt: string;
};

export type ResponseDeleted = ResponseObject & {
  deletedAt: Date;
  isDeleted: boolean;
  save: () => { username: string } | PromiseLike<{ username: string }>;
};
