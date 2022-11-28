import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Guard } from '../guard/token.guard';
import { ReqFriendDocument, User } from '../model/user.model';
import { UserService } from '../service/user.service';
// import { Request, Response, NextFunction } from 'express';

@Controller('user')
export class UserController {
  //  implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly guard: Guard,
  ) {}

  // use(req: any, res: any, next: (error?: any) => void) {
  //   throw new Error('Method not implemented.');
  // }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.guard.login(email, password);
  }

  @Post('create-user')
  async createUser(@Body() user: User) {
    return await this.userService.createUser(user);
  }

  @Get('list-user')
  async listUser() {
    return await this.userService.listUser();
  }

  @Get('find-user-by-id/:id')
  async findUserById(@Param('id') id: string) {
    return await this.userService.findUserById(id);
  }

  @Get('find-user-by-name/:name')
  async findUserByName(@Param('name') name: string) {
    return await this.userService.findUserByName(name);
  }

  @Post('update-user/:id')
  async updateUser(@Param('id') id: string, @Body() user: User) {
    return await this.userService.updateUser(id, user);
  }

  @Get('list-request-friend')
  async listRequestFriend() {
    return await this.userService.listRequestFriend();
  }

  @Post('request-friend')
  async requestFriend(@Body() req: ReqFriendDocument) {
    return await this.userService.requestFriend(req);
  }

  @Post('add-friend')
  async addFriend(@Body() req: ReqFriendDocument) {
    return await this.userService.addFriend(req);
  }

  @Post('reject-friend/:id')
  async rejectFriend(@Param('id') id: string) {
    return await this.userService.rejectFriend(id);
  }
}
