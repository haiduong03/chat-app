import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnGatewayInit } from '@nestjs/websockets/interfaces';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(parseInt(process.env.SOCKET_PORT))
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('ChatGateway');

  afterInit() {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('messageToServer')
  handleMessage(
    client: Socket,
    data: { sender: string; room: string; message: string },
  ) {
    this.server.emit('messageToClient', data);
  }
}
