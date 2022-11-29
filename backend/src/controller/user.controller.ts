import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Guard } from '../guard/token.guard';
import { RequestFriend, User } from '../model/user.model';
import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly guard: Guard,
  ) {}

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

  @Get('all-user')
  async allUser() {
    return await this.userService.allUser();
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

  @Get('list-request-friend/:id')
  async listRequestFriend(@Param('id') id: string) {
    return await this.userService.listRequestFriend(id);
  }

  @Get('list-request-friend-by-id/:id')
  async listRequestFriendById(@Param('id') id: string) {
    return await this.userService.listRequestFriendById(id);
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

  @Get('all-message')
  async allMessage() {
    return await this.userService.allMessage();
  }
}
