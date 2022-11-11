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
    this.logger.log('Initialized');
  }

  // @SubscribeMessage('message')
  // handleMessage(Client: Socket, message: { sender: string; message: string }) {
  //   this.server.emit('messageToClient', message);
  // }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(Client: Socket, Room: []) {
    Client.join(Room);
    Client.emit('joinedRoom', Room);

    console.log(Client.emit('joinedRoom', Room));
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(Client: Socket, Room: string) {
    Client.leave(Room);
    Client.emit('leftRoom', Room);
  }

  @SubscribeMessage('messageToRoom')
  handleMessage(
    Client: Socket,
    Data: {
      Sender: string;
      Message: string;
      Room: Array<string>;
    },
  ) {
    Data.Room.forEach((e) => {
      this.server.in(`${e}`).emit('messageToRoom', Data);
    });
  }
}
