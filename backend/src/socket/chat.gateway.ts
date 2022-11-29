import { Logger } from '@nestjs/common';
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
export class ChatGateway implements OnGatewayInit, OnGatewayConnection {
  constructor(
    @InjectModel('message') private readonly message: Model<Messages>,
  ) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('connection')
  handleConnection(client: Socket, user: string) {
    this.server.emit('connected', `${user} joined`);
    // throw new Error('Method not implemented.');
  }

  afterInit() {
    console.log('Initialized!');
  }

  @SubscribeMessage('typing')
  handleTyping(client: Socket, sender: string) {
    this.server.emit('messageToClient', `${sender} is typing ...`);
  }

  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, data: Messages) {
    // const message = new essage();
    this.server.emit('messageToClient', data);

    return new this.message(data).save();
  }
}
