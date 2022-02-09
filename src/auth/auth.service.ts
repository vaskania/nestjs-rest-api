import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/db/repository/user.repository';
import { HashPassword } from 'src/utils/crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private readonly hashPassword: HashPassword,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.userRepo.findUser(username);
    if (!user) return null;

    const userMatch = await this.hashPassword.hashPassword(pass, user.salt);

    if (userMatch.hash === user.password) return user;
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
