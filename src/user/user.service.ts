import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/db/repository/user.repository';
import { CreateUserDTO } from './dto/create-user.dto';
import { HashPassword } from 'src/utils/crypto';
import { UpdateUserDTO } from './dto/update-user.dto';

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

    data = { ...data, password: hash, salt };

    return this.userRepo.createUser(data);
  }

  async updateProfile(data: UpdateUserDTO, username: string): Promise<any> {
    const findUserToUpdate = await this.userRepo.findUser(username);
    if (findUserToUpdate) await this.userRepo.updateProfile(data);
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}
