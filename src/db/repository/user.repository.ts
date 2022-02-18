import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../interface/user.interface';
import { UpdateUserDTO } from 'src/user/dto/update-user.dto';
import {
  TResponseDeleted,
  TResponseObject,
  TNameOnlyUser,
} from '../../user/types/user-field.type';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel('user')
    private readonly userModel: Model<User>,
  ) {}

  async createUser(user: CreateUserDTO): Promise<TNameOnlyUser> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findUser(username: string): Promise<TResponseObject> {
    return this.userModel.findOne({ username });
  }

  async getUserById(id: string): Promise<TResponseDeleted> {
    return this.userModel.findById(id);
  }

  async updateProfile(data: Partial<UpdateUserDTO>, id: string): Promise<void> {
    const user = await this.getUserById(id);
    const updatedUser = Object.assign(user, data);
    await updatedUser.save();
  }

  async getUsers(
    pageNumber: string,
    limit: string,
  ): Promise<{ username: string; firstname: string; lastname: string }[]> {
    return this.userModel
      .find({ isDeleted: false })
      .skip(+pageNumber > 0 ? (+pageNumber - 1) * +limit : 0)
      .limit(+limit);
  }

  async deleteUserById(id: string): Promise<{ username: string }> {
    const user = await this.getUserById(id);
    user.isDeleted = true;
    user.deletedAt = new Date();
    return user.save();
  }
}
