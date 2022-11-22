import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from '../model/user.schema';
import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  async login(
    @Body('userName') name: string,
    @Body('password') password: string,
  ) {
    return await this.userService.login(name, password);
  }

  @Post('/create-user')
  async createUser(@Body() user: User) {
    return await this.userService.createUser(user);
  }

  @Get('/list-user')
  async listUser() {
    return await this.userService.listUser();
  }

  @Get('/find-user-by-id/:id')
  async findUserById(@Param('id') id: string) {
    return await this.userService.findUserById(id);
  }

  @Post('update-user/:id')
  async updateUser(@Param('id') id: string, @Body() user: User) {
    return await this.userService.updateUser(id, user);
  }
}
