import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';

const data = {
  username: 'vaskania',
  firstname: 'vasili',
  lastname: 'nikabadze',
  password: '123456',
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const fakeUserService: Partial<UserService> = {
      createUser: (createUserDto: CreateUserDTO) => {
        return Promise.resolve({ username: createUserDto.username });
      },
    };

    const fakeAuthService: Partial<AuthService> = {};

    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: fakeUserService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('create new user', async () => {
    const userCreated = await controller.createUser(data);
    expect(userCreated).toBeDefined();
  });
});
