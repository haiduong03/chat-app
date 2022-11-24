import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../model/user.model';
import { hashSync, genSaltSync, compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async login(name: string, password: string) {
    try {
      const user = await this.findUserByName(name);
      const compare = compareSync(
        password.toString(),
        user.password.toString(),
      );
      if (user && compare == true) {
        const payload = { id: user._id, name: user.userName };
        const token = this.jwtService.sign(payload);
        return token;
      } else return 'Login failed !!!';
    } catch (err) {
      return err;
    }
  }

  async createUser(user: User) {
    try {
      const salt = genSaltSync(parseInt(process.env.HASH_SALT));
      const hash = hashSync(user.password.toString(), salt);
      user.password = hash;
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

  async updateUser(id: string, user: User) {
    try {
      return await this.userModel.findByIdAndUpdate(id, user, { new: true });
    } catch (err) {
      return err;
    }
  }
}
