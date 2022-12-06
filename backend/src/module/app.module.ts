import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenMiddleware } from 'src/middleware/token.middleware';
import { UserController } from '../controller/user.controller';
import { message, reqFriend, room, userModel } from '../model/user.model';
import { UserService } from '../service/user.service';
import { ChatGateway } from '../socket/chat.gateway';
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
        name: 'reqFriend',
        schema: reqFriend,
      },
      {
        name: 'message',
        schema: message,
      },
      {
        name: 'room',
        schema: room,
      },
    ]),
    JwtModule.register({ secret: process.env.TOKEN_KEY }),
  ],
  controllers: [UserController],
  providers: [UserService, ChatGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMiddleware)
      .exclude(
        { path: 'user/login', method: RequestMethod.POST },
        { path: 'user/create-user', method: RequestMethod.POST },
      )
      .forRoutes(UserController);
  }
}
