export type TNameOnlyUser = {
  username: string;
};

export type TUserData = {
  username: TNameOnlyUser;
  createdAt: Date;
  updatedAt: Date;
};

export type TResponseObject = {
  username: TNameOnlyUser;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
  password: string;
  salt: string;
};

export type TResponseDeleted = TResponseObject & {
  deletedAt: Date;
  isDeleted: boolean;
  save: () => { username: string } | PromiseLike<{ username: string }>;
};
