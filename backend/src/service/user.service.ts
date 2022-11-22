import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../model/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<UserDocument>,
  ) {}

  async login(name: string, password: string): Promise<User> {
    try {
      // return new this.userModel(user).save();
      const person = await this.findUserByName(name);

      if (password == person.password && name == person.userName) {
        return person;
      }
    } catch (err) {
      return err;
    }
  }

  async createUser(user: User): Promise<User> {
    try {
      return await new this.userModel(user).save();
    } catch (err) {
      return err;
    }
  }

  async listUser() {
    try {
      return await this.userModel.find({});
    } catch (err) {
      return err;
    }
  }

  async findUserById(id: string) {
    try {
      return await this.userModel.findById(id);
    } catch (err) {
      return err;
    }
  }

  async findUserByName(name: string) {
    try {
      return await this.userModel.findOne({ userName: name });
    } catch (err) {
      return err;
    }
  }

  async updateUser(id: string, user: User): Promise<User> {
    try {
      return await this.userModel.findByIdAndUpdate(id, user, { new: true });
    } catch (err) {
      return err;
    }
  }
}
