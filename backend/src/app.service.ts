import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './model/user.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(user: User): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async listUser() {
    const listUser = await this.userModel.find({});
    console.log(listUser);
  }

  // async updateUser(user: User): Promise<User> {
  // return this.userModel.findByIdAndUpdate(user, user, { new: true });
  // }
}
