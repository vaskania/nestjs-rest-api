import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/db/interface/user.interface';

import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './user.service';

describe('UserService', () => {
  let service = UserService;

  beforeEach(async () => {
    const fakeUserService: Partial<UserService> = {
      createUser: (createUserDTO: CreateUserDTO) =>
        Promise.resolve({ username: createUserDTO.username } as User),
      getUsers: () => Promise.resolve([]),
    };

    const fakeHashPass = {
      hashPassword: () => Promise.resolve(),
    };

    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(UserService);
  });

  it('can create instance', async () => {
    expect(service).toBeDefined();
  });

  it('create new user', async () => {});
});
