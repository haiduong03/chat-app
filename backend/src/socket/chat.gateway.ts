import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnGatewayInit } from '@nestjs/websockets/interfaces';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(81, { cors: true })
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('ChatGateway');

  afterInit() {
    this.logger.log('Initialized!');
    // console.log(this.server.adapter.room);
  }

  // @SubscribeMessage('joinRoom')
  // handleRoomJoin(client: Socket, room: string) {
  //   client.join(room);
  //   console.log(client.rooms);
  //   client.emit('joinedRoom', room);
  //   console.log(client.rooms);
  // }

  // @SubscribeMessage('leaveRoom')
  // handleRoomLeave(client: Socket, room: string) {
  //   client.leave(room);
  //   client.emit('leftRoom', room);
  // }

  @SubscribeMessage('messageToServer')
  handleMessage(
    client: Socket,
    data: { sender: string; room: string; message: string },
  ) {
    this.server.emit('messageToClient', data);
  }
}
