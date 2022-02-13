import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/db/repository/user.repository';
import { CreateUserDTO } from './dto/create-user.dto';
import { HashPassword } from 'src/utils/crypto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { ResponseObject } from './user.constants';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly hashPassword: HashPassword,
  ) {}

  async createUser(data: CreateUserDTO): Promise<{ username: string }> {
    const user = data.username;
    const findExistUser = await this.userRepo.findUser(user);
    if (!findExistUser) {
      const { hash, salt } = await this.hashPassword.hashPassword(
        data.password,
      );
      const updatedData = { ...data, password: hash, salt };

      return this.userRepo.createUser(updatedData);
    }
  }

  async updateProfile(
    data: Partial<UpdateUserDTO>,
    username: string,
  ): Promise<{ username: string }> {
    const user = await this.userRepo.findUser(username);
    if (user) {
      const updatedData = { ...data };
      if (updatedData.password) {
        const { hash, salt } = await this.hashPassword.hashPassword(
          updatedData.password,
        );
        updatedData.password = hash;
        updatedData.salt = salt;
      }
      return this.userRepo.updateProfile(updatedData, user._id);
    }
  }

  async getUser(
    username: string,
  ): Promise<{ username: string; createdAt: Date; updatedAt: Date } | null> {
    return this.userRepo.findUser(username);
  }

  async getUsers(
    pageNumber: string,
    limit: string,
  ): Promise<{ username: string; firstname: string; lastname: string }[]> {
    const usersList = await this.userRepo.getUsers(pageNumber, limit);
    if (usersList.length !== 0) {
      throw new Error('User not found');
    }
    return usersList;
  }

  async deleteUser(username: string): Promise<{ username: string }> {
    const user = await this.userRepo.findUser(username);
    if (user) return this.userRepo.deleteUserById(user._id);
  }
}
