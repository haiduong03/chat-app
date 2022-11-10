import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnGatewayInit } from '@nestjs/websockets/interfaces';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger();

  afterInit(server: Socket) {
    server.connected;
    this.logger.log('Initialized');
  }

  @SubscribeMessage('messageToServer')
  handleMessage(Client: Socket, message: { sender: string; message: string }) {
    this.server.emit('messageToClient', message);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(Client: Socket, Room: string) {
    Client.join(Room);
    Client.emit('joinedRoom', Room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(Client: Socket, Room: string) {
    Client.leave(Room);
    Client.emit('leftRoom', Room);
  }
}
