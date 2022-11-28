import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';
import { Model } from 'mongoose';
import { User, UserDocument, ReqFriend } from '../model/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<UserDocument>,
    @InjectModel('requestFriend')
    private readonly reqFriend: Model<UserDocument>,
  ) {}

  async createUser(user: User) {
    try {
      const salt = genSaltSync(parseInt(process.env.HASH_SALT));
      const hash = hashSync(user.password.toString(), salt);
      user.password = hash;

      await new this.userModel(user).save();

      return { result: 'successful' };
    } catch (err) {
      return err;
    }
  }

  async listUser() {
    try {
      return await this.userModel.find();
    } catch (err) {
      return err;
    }
  }

  async findUserById(id: string) {
    try {
      return await this.userModel.findOne({ _id: id });
    } catch (err) {
      return err;
    }
  }

  async findUserByName(name: string) {
    try {
      return await this.userModel.findOne({ name: name });
    } catch (err) {
      return err;
    }
  }

  async findUserByEmail(email: string) {
    try {
      return await this.userModel.findOne({ email: email });
    } catch (err) {
      return err;
    }
  }

  async updateUser(id: string, user: User) {
    try {
      await this.userModel.findByIdAndUpdate(id, user);
      return { result: 'successful' };
    } catch (err) {
      return err;
    }
  }

  async requestFriend(req: ReqFriend) {
    try {
      await new this.reqFriend(req).save();
      return { result: 'successful' };
    } catch (err) {
      return err;
    }
  }

  async listRequestFriend() {
    try {
      return await this.reqFriend.find();
    } catch (err) {
      return err;
    }
  }

  async addFriend(from: string, to: string) {
    try {
      // const fr = new Types.ObjectId(from);
      // const t = new Types.ObjectId(to);
      await this.userModel.findByIdAndUpdate(to, { $push: { friend: from } });
      await this.userModel.findByIdAndUpdate(from, { $push: { friend: to } });
      await this.reqFriend.findOneAndUpdate({ from: from }, { status: 1 });

      return { result: 'successful' };
    } catch (err) {
      return err;
    }
  }
}
