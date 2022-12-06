import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { Model } from 'mongoose';
import { Messages, RequestFriend, Room, User } from '../model/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<User>,
    @InjectModel('reqFriend')
    private readonly reqFriend: Model<RequestFriend>,
    @InjectModel('message') private readonly message: Model<Messages>,
    @InjectModel('room') private readonly room: Model<Room>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(user: User) {
    try {
      const salt = genSaltSync(parseInt(process.env.HASH_SALT));
      const hash = hashSync(user.password.toString(), salt);
      user.password = hash;

      await new this.userModel(user).save();

      return { result: 'Successful' };
    } catch (err) {
      return err;
    }
  }

  async allUser() {
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
      return { result: 'Successful' };
    } catch (err) {
      return err;
    }
  }

  async requestFriend(req: RequestFriend) {
    try {
      await new this.reqFriend(req).save();
      return { result: 'Successful' };
    } catch (err) {
      return err;
    }
  }

  async listReceiveRequestFriend(name: string) {
    try {
      return await this.reqFriend.find({ to: name, status: false });
    } catch (err) {
      return err;
    }
  }

  async listSendRequestFriend(name: string) {
    try {
      return await this.reqFriend.find({ from: name, status: false });
    } catch (err) {
      return err;
    }
  }

  async findRequestFriendById(id: string) {
    try {
      return await this.reqFriend.findOne({ to: id });
    } catch (err) {
      return err;
    }
  }

  async addFriend(req: RequestFriend) {
    try {
      await this.userModel.findByIdAndUpdate(req.to, {
        $push: { friend: req.from },
      });
      await this.userModel.findByIdAndUpdate(req.from, {
        $push: { friend: req.to },
      });
      await this.reqFriend.findOneAndUpdate({ _id: req.id }, { status: 1 });

      return { result: 'Successful' };
    } catch (err) {
      return err;
    }
  }

  async rejectFriend(id: string) {
    try {
      await this.reqFriend.findOneAndUpdate({ _id: id }, { status: 1 });
      return { result: 'Successful' };
    } catch (err) {
      return err;
    }
  }

  async allMessage(room: string) {
    try {
      return await this.message
        .findOne({ to: room })
        .sort({ createdAt: -1 })
        .limit(20);
    } catch (err) {
      return err;
    }
  }

  async allRoom(email: string) {
    try {
      return await this.room.findOne({ email: email });
    } catch (err) {
      return err;
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.findUserByEmail(email);

      if (user) {
        const compare = compareSync(
          password.toString(),
          user.password.toString(),
        );
        if (compare == true) {
          const token = this.jwtService.sign({
            id: user._id,
            name: user.name,
          });
          return { token };
        }
      }

      return { result: 'Wrong user name or password !!!' };
    } catch (err) {
      return err;
    }
  }
}
