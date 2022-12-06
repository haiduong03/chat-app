import { InjectModel } from '@nestjs/mongoose';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnGatewayInit } from '@nestjs/websockets/interfaces';
import { Model } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { Messages, Room, User } from './../model/user.model';
import { TokenMiddleware } from '../middleware/token.middleware';

// @WebSocketGateway(+process.env.SOCKET_PORT)
@WebSocketGateway(80)
export class ChatGateway implements OnGatewayInit {
  constructor(
    @InjectModel('message') private readonly message: Model<Messages>,
    @InjectModel('room') private readonly room: Model<Room>,
    @InjectModel('user') private readonly userModel: Model<User>, // private readonly tokenMiddleware: TokenMiddleware,
  ) {}

  @WebSocketServer() server: Server;

  afterInit() {}

  ///////////////////////////////////////////////
  // @SubscribeMessage('connection')
  // handleConnection(client: Socket, data: { name: string; room: string }) {
  //   client.join(data.room);
  //   this.server.to(data.room).emit('connected', `${data.name} connected`);
  // }

  @SubscribeMessage('create-room')
  async handleMessageToRoom(
    client: Socket,
    data: { room: string; email: string },
  ) {
    const roomData = await this.room.findOne({ name: data.room });
    if (!roomData) {
      client.join(data.room);
      this.server.to(data.room).emit('created-room', `${data.room}`);
      new this.room({ name: data.room }).save();
      await this.userModel.findOneAndUpdate(
        { email: data.email },
        { $push: { room: data.room } },
      );
    } else this.server.to(client.id).emit('created-room', 0); //return 0 neu room ton tai
  }

  @SubscribeMessage('join-room')
  async handleJoinToRoom(client: Socket, room: string) {
    const roomData = await this.room.findOne({ name: room });
    if (roomData) {
      client.join(room);
      this.server.to(room).emit(`joined-room`, `${client.id} joined ${room}`);
    } else this.server.to(room).emit('joined-room', 0); //return 0 neu khong tim thay room
  }

  @SubscribeMessage('leave-room')
  async handleLeaveToRoom(client: Socket, room: string) {
    client.leave(room);
    // await this.userModel.findOneAndUpdate(
    //   { email: data.email },
    //   { $push: { room: data.room } },
    // );
    this.server.to(room).emit(`left-room`, `${client.id} leave`);
  }

  @SubscribeMessage('send')
  handleChatToRoom(client: Socket, data: Messages) {
    client.join(data.to);
    this.server.to(data.to).emit(`receive`, data);
    new this.message(data).save();
  }

  // @SubscribeMessage('typing')
  // async handleTyping(client: Socket, data: Messages) {
  //   await this.server
  //     .to(data.to)
  //     .emit('messageToClient', `${data.sender} is typing ...`);
  // }
}
