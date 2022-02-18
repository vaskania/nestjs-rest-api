import { CreateUserDTO } from '../../src/user/dto/create-user.dto';
import { LoginUserDTO } from '../../src/user/dto/user-login.dto';

export const TestUserRegisterFailDto: CreateUserDTO = {
  username: 'vaskania1',
  firstname: 'vasili',
  lastname: 'nikabadze',
  password: '12345',
};

export const TestUserLoginFailDto: LoginUserDTO = {
  username: 'vaskania12',
  password: '123456',
};

export const TestUpdateFailData = {
  firstname: 'vaska',
  lastname: 'NIKA',
  password: '12345',
};

export const TestUsernameFail = 'vaskania12';
export const pageNumber = 'a';
export const limit = 'a';

export const fakeAccessToken = 'abc';