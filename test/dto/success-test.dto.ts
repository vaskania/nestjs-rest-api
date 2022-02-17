import { CreateUserDTO } from '../../src/user/dto/create-user.dto';
import { LoginUserDTO } from '../../src/user/dto/user-login.dto';

export const TestUserRegisterDto: CreateUserDTO = {
  username: 'vaskania1',
  firstname: 'vasili',
  lastname: 'nikabadze',
  password: '123456',
};

export const TestUserLoginDto: LoginUserDTO = {
  username: 'vaskania1',
  password: '123456',
};

export const TestUpdateData = {
  firstname: 'VASKANIA',
  lastname: 'NIKABADZE',
  password: '123456',
};

export const TestUsername = 'vaskania22';
export const pageNumber = 0;
export const limit = 2;
