import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/db/repository/user.repository';
import { HashPassword } from 'src/utils/crypto';

@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private readonly hashPassword: HashPassword,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.userRepo.findUser(username);
    if (!user) return null;

    const userMatch = await this.hashPassword.hashPassword(pass);
    console.log(userMatch);
    console.log(user);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      console.log(password);
      return result;
    }
    return null;
  }
}
