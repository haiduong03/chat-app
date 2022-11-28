import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnGatewayInit } from '@nestjs/websockets/interfaces';
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

  private logger: Logger = new Logger('ChatGateway');

  afterInit() {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('typing')
  handleTyping(client: Socket, sender: string) {
    this.server.emit('messageToClient', `${sender} is typing ...`);
  }

  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, data: Messages) {
    // const message = new essage();
    this.server.emit('messageToClient', data);
    async () => {
      await new this.message(data).save();
    };
  }
}
