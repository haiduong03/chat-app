import { message, reqFriend, userModel } from '../model/user.model';
import { Module } from '@nestjs/common';
import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';
import { ChatGateway } from '../socket/chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Guard } from 'src/guard/token.guard';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGODB_URL_1 || process.env.MONGODB_URL_2,
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
      {
        name: 'message',
        schema: message,
      },
    ]),
    JwtModule.register({ secret: process.env.TOKEN_KEY }),
  ],
  controllers: [UserController],
  providers: [UserService, ChatGateway, Guard],
})
export class AppModule {}
