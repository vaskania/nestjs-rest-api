import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../interface/user.interface';

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

  async updateProfile(
    data: { firstname: string; lastname: string; password: string },
    salt: string,
    id: string,
  ) {
    const user = await this.getUserById(id);

    const updatedUser = { ...user };

    if (data.firstname) {
      updatedUser.firstname = data.firstname;
    }
    if (data.lastname) {
      updatedUser.lastname = data.lastname;
    }
    if (data.password) {
      updatedUser.password = data.password;
    }
    return this.userModel.findByIdAndUpdate(
      { _id: id },
      {
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        password: updatedUser.password,
        salt,
      },
    );
  }

  async getUsers(pageNumber: string, limit: string) {
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
