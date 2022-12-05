import { InjectModel } from '@nestjs/mongoose';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  OnGatewayConnection,
  OnGatewayInit,
} from '@nestjs/websockets/interfaces';
import { Model } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { Messages } from './../model/user.model';

// @WebSocketGateway(+process.env.SOCKET_PORT)
@WebSocketGateway(80)
export class ChatGateway implements OnGatewayInit {
  constructor(
    @InjectModel('message') private readonly message: Model<Messages>,
  ) {}

  @WebSocketServer() server: Server;

  afterInit() {}

  // handleConnection(client: Socket) {
  //   this.server.join('room1');
  //   throw new Error('Method not implemented.');
  // }

  @SubscribeMessage('send')
  async handleMessage(client: Socket, data: Messages) {
    this.server.emit('receive', data);
    await new this.message(data).save();
  }

  @SubscribeMessage('create-room')
  handleMessageToRoom(client: Socket, room: string) {
    client.join(room);
    this.server.to(room).emit('created-room', `${room} created`);
  }

  @SubscribeMessage('join-room')
  handleJoinToRoom(client: Socket, room: string) {
    client.join(room);
    this.server.to(room).emit(`joined-room`, `${client.id} joined`);
    // const text = async () =>
    //   await this.server.to(room).emit(`joined-room`, `${client.id} joined`);
    // text();
  }

  @SubscribeMessage('send-to-room')
  handleChatToRoom(client: Socket, data: any) {
    client.join(data.room);
    this.server.to(data.room).emit(`receive-from-room`, data);
    // const text = async () =>
    //   await client.to(data.room).emit(`receive-form-room`, data);
    // text();
  }

  // @SubscribeMessage('typing')
  // handleTyping(client: Socket, sender: string) {
  //   this.server.emit('messageToClient', `${sender} is typing ...`);
  // }
}
