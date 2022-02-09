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

  async createUser(user: object): Promise<any> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findUser(username: string): Promise<any> {
    return this.userModel.findOne({ username });
  }

  async getUserById(id: string): Promise<any> {
    return await this.userModel.findById(id);
  }

  async updateProfile(data) {
    const user = await this.getUserById(data.id);
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
      { _id: data.id },
      {
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        password: updatedUser.password,
      },
    );
  }
}
