import { userModel } from '../model/user.schema';
import { Module } from '@nestjs/common';
import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';
import { ChatGateway } from '../socket/chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://127.0.0.1:27017/chat-app' ||
        'mongodb://localhost:27017/chat-app',
    ),
    MongooseModule.forFeature([
      {
        name: 'user',
        schema: userModel,
      },
    ]),
    ConfigModule.forRoot(),
  ],
  controllers: [UserController],
  providers: [UserService, ChatGateway],
})
export class AppModule {}
