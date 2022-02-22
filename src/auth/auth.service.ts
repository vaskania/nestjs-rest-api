import { Injectable } from '@nestjs/common';
import { UserRepository } from '../db/repository/user.repository';
import { HashPassword } from '../utils/crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private readonly hashPassword: HashPassword,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<{ username: string; _id: string; role: string } | null | any> {
    const user = await this.userRepo.findUser(username);
    if (!user) {
      return null;
    }

    const userMatch = await this.hashPassword.hashPassword(pass, user.salt);

    if (userMatch.hash === user.password) {
      return { username: user.username, _id: user._id, role: user.role };
    }
    return null;
  }

  async login(user: {
    username: string;
    role: string;
  }): Promise<{ access_token: string }> {
    const payload = { username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
