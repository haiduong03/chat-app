import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RequestFriend, Room, User } from '../model/user.model';
import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.userService.login(email, password);
  }

  @Post('create-user')
  async createUser(@Body() user: User) {
    return await this.userService.createUser(user);
  }

  @Get('all-user')
  async allUser() {
    return await this.userService.allUser();
  }

  @Get('find-user-by-id/:id')
  async findUserById(@Param('id') id: string) {
    return await this.userService.findUserById(id);
  }

  @Get('find-user-by-email/:email')
  async findUserByEmail(@Param('email') email: string) {
    return await this.userService.findUserByEmail(email);
  }

  @Get('find-user-by-name/:name')
  async findUserByName(@Param('name') name: string) {
    return await this.userService.findUserByName(name);
  }

  @Post('update-user/:id')
  async updateUser(@Param('id') id: string, @Body() user: User) {
    return await this.userService.updateUser(id, user);
  }

  @Get('list-receive-request-friend/:name')
  async listReceiveRequestFriend(@Param('name') name: string) {
    return await this.userService.listReceiveRequestFriend(name);
  }

  @Get('list-send-request-friend/:name')
  async listSendRequestFriend(@Param('name') name: string) {
    return await this.userService.listSendRequestFriend(name);
  }

  @Get('find-request-friend-by-id/:id')
  async findRequestFriendById(@Param('id') id: string) {
    return await this.userService.findRequestFriendById(id);
  }

  @Post('request-friend')
  async requestFriend(@Body() req: RequestFriend) {
    return await this.userService.requestFriend(req);
  }

  @Post('add-friend')
  async addFriend(@Body() req: RequestFriend) {
    return await this.userService.addFriend(req);
  }

  @Post('reject-friend/:id')
  async rejectFriend(@Param('id') id: string) {
    return await this.userService.rejectFriend(id);
  }

  @Get('all-message/:name')
  async allMessage(@Param('name') name: string) {
    return await this.userService.allMessage(name);
  }

  @Get('all-room/:name')
  async allRoom(@Param('name') name: string) {
    return await this.userService.allRoom(name);
  }
}
