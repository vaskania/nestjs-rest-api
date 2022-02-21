import { Injectable } from '@nestjs/common';
import { UserRepository } from '../db/repository/user.repository';
import { CreateUserDTO } from './dto/create-user.dto';
import { HashPassword } from '../utils/crypto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { TUserData, TNameOnlyUser } from './types/user-field.type';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly hashPassword: HashPassword,
  ) {
  }

  async createUser(data: CreateUserDTO): Promise<void> {
    const user = data.username;
    const findExistUser = await this.userRepo.findUser(user);
    if (findExistUser) throw  new Error();
    if (!findExistUser) {
      const { hash, salt } = await this.hashPassword.hashPassword(
        data.password,
      );
      const updatedData = { ...data, password: hash, salt };

      await this.userRepo.createUser(updatedData);
    }
    console.log(findExistUser);
  }

  async updateProfile(
    data: Partial<UpdateUserDTO>,
    username: string,
  ): Promise<void> {
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
      await this.userRepo.updateProfile(updatedData, user._id);
    }
  }

  async getUser(username: string): Promise<TUserData | null> {
    return this.userRepo.findUser(username);
  }

  async getUsers(
    pageNumber: string,
    limit: string,
  ): Promise<{ username: string; firstname: string; lastname: string }[]> {
    const usersList = await this.userRepo.getUsers(pageNumber, limit);
    if (usersList.length === 0) {
      throw new Error('User not found');
    }
    return usersList;
  }

  async deleteUser(username: string): Promise<TNameOnlyUser> {
    const user = await this.userRepo.findUser(username);
    if (user) return this.userRepo.deleteUserById(user._id);
  }
}
