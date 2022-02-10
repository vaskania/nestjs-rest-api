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

  async createUser(data: CreateUserDTO): Promise<{ username: string }> {
    const user = data.username;
    const findExistUser = await this.userRepo.findUser(user);
    if (findExistUser)
      throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
    const { hash, salt } = await this.hashPassword.hashPassword(data.password);

    const updatedData = { ...data, password: hash, salt };

    return this.userRepo.createUser(updatedData);
  }

  async updateProfile(
    data: { firstname: string; lastname: string; password: string },
    username: string,
  ): Promise<{ username: string }> {
    const user = await this.userRepo.findUser(username);
    if (user) {
      let salt: string;
      if (data.password) {
        const { hash, salt: newSalt } = await this.hashPassword.hashPassword(
          data.password,
        );
        data.password = hash;
        salt = newSalt;
      }
      const updatedUser = await this.userRepo.updateProfile(
        data,
        salt,
        user._id,
      );
      return updatedUser;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async getUser(
    username: string,
  ): Promise<{ username: string; createdAt: Date; updatedAt: Date }> {
    const user = await this.userRepo.findUser(username);
    if (user) return user;
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async getUsers(pageNumber: string, limit: string) {
    const usersList = await this.userRepo.getUsers(pageNumber, limit);
    if (usersList.length === 0)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return usersList;
  }

  async deleteUser(username: string): Promise<{ username: string }> {
    const user = await this.userRepo.findUser(username);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return this.userRepo.deleteUserById(user._id);
  }
}
