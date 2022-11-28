import { reqFriend, userModel } from '../model/user.model';
import { Module } from '@nestjs/common';
import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';
import { ChatGateway } from '../socket/chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Guard } from 'src/guard/token.guard';

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
      {
        name: 'requestFriend',
        schema: reqFriend,
      },
    ]),
    ConfigModule.forRoot(),
    JwtModule.register({ secret: process.env.TOKEN_KEY }),
  ],
  controllers: [UserController],
  providers: [UserService, ChatGateway, Guard],
})
export class AppModule {}
