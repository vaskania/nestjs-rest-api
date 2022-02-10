import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../interface/user.interface';
import { UpdateUserDTO } from 'src/user/dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel('user')
    private readonly userModel: Model<User>,
  ) {}

  async createUser(user: object): Promise<{ username: string }> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findUser(username: string): Promise<any> {
    return this.userModel.findOne({ username });
  }

  async getUserById(id: string): Promise<any> {
    return await this.userModel.findById(id);
  }

  async updateProfile(data: Partial<UpdateUserDTO>, id: string) {
    const user = await this.getUserById(id);
    const updatedUser = await Object.assign(user, data);
    return updatedUser.save();
  }

  async getUsers(
    pageNumber: string,
    limit: string,
  ): Promise<{ username: string; firstname: string; lastname: string }[]> {
    const users = await this.userModel
      .find({ isDeleted: false })
      .skip(+pageNumber > 0 ? (+pageNumber - 1) * +limit : 0)
      .limit(+limit);
    return users;
  }

  async deleteUserById(id: string): Promise<{ username: string }> {
    const user = await this.getUserById(id);
    user.isDeleted = true;
    user.deletedAt = new Date();
    user.save();
    return user;
  }
}
