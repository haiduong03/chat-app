import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnGatewayInit } from '@nestjs/websockets/interfaces';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(81, { cors: true }) //tao
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  // private logger: Logger = new Logger();

  afterInit() {}

  // handleConnection(client: Socket) {
  //   // console.log(client.id);
  //   this.server.emit('connected', client.id);
  // }

  // handleDisconnect(client: Socket) {
  //   this.server.emit('disconnected', client.id);
  // }
  // @SubscribeMessage('message')
  // handleMessage(Client: Socket, message: { sender: string; message: string }) {
  //   this.server.emit('messageToClient', message);
  // }

  // @SubscribeMessage('createRoom')
  // handleCreateRoom(Client: Socket, Room: string) {
  //   Client.join(Room);
  //   Client.emit('joinedRoom', Room);
  //   // console.log(Room);
  // }

  // @SubscribeMessage('joinRoom')
  // handleJoinRoom(Client: Socket, Room: []) {
  //   Client.join(Room);
  //   // Client.emit('joinedRoom', Room);
  // }

  // @SubscribeMessage('listRoom')
  // handleListRoom(Client: Socket, listRoom: []) {
  //   this.server.emit('room', Client.id);
  // }

  @SubscribeMessage('messageToServer')
  handleMessage(
    client: Socket,
    data: { sender: string; room: string; message: string; time: string },
  ) {
    this.server.emit('messageToClient', data);
  }

  // @SubscribeMessage('img')
  // handleFile(file: any) {
  //   console.log(file); // <Buffer 25 50 44 ...>

  //   // save the content to the disk, for example
  //   // writeFile('/tmp/upload', file, (err) => {
  //   //   callback({ message: err ? 'failure' : 'success' });
  //   // });
  // }
}
