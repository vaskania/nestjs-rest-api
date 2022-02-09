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
}
