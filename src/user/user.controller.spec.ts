import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import exp from 'constants';

const data: CreateUserDTO = {
  username: 'vaskania',
  firstname: 'vasili',
  lastname: 'nikabadze',
  password: '123456',
};

const updateData: UpdateUserDTO = {
  firstname: 'vaska',
  lastname: 'nikabadze',
  password: '123456',
  salt: 'salttohex',
};

describe('UserController', () => {
  let controller: UserController;
  beforeEach(async () => {
    const fakeAuthService: Partial<AuthService> = {};

    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: createMock<UserService>() },
        { provide: AuthService, useValue: createMock<AuthService>() },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('Create new user', async () => {
    const userCreated = await controller.createUser(data);
    expect({ user: userCreated.user }).toBeDefined();
  });

  it('Find user by username', async () => {
    const user = await controller.getUserProfile(data.username);
    expect({ username: user.username }).toBeDefined();
  });

  it('Update user profile by username', async () => {
    const userForUpdate = await controller.updatedProfile(
      updateData,
      data.username,
    );
    expect(userForUpdate).toBeDefined();
    expect('updated successfully').toStrictEqual(userForUpdate);
  });
});

