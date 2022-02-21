import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { HashPassword } from './crypto';
import { LoginUserDTO } from '../user/dto/user-login.dto';
import { randomBytes } from 'crypto';


const login: LoginUserDTO = {
  'username': 'vaska',
  'password': '12356',
};

let salt = randomBytes(16).toString('hex');

describe('AuthService', () => {
  let hashPassword: HashPassword;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HashPassword,
      ],
    }).compile();

    hashPassword = module.get<HashPassword>(HashPassword);
  });

  it('Hash Password', async () => {
    const hashedPass = await hashPassword.hashPassword(login.password, salt);
    expect(typeof hashedPass.hash).toBe('string');
    expect(login.password !== hashedPass.hash);
    expect(typeof salt).toBe('string');
  });

});