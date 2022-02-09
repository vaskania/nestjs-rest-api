import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/db/repository/user.repository';
import { CreateUserDTO } from './dto/create-user.dto';
import { HashPassword } from 'src/utils/crypto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly hashPassword: HashPassword,
  ) {}

  async createUser(data: CreateUserDTO): Promise<any> {
    const user = data.username;
    const findExistUser = await this.userRepo.findUser(user);
    if (findExistUser)
      throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
    const { hash, salt } = await this.hashPassword.hashPassword(data.password);

    return this.userRepo.createUser({
      username: data.username,
      firstname: data.firstname,
      lastname: data.lastname,
      password: hash,
      salt,
    });
  }
}
