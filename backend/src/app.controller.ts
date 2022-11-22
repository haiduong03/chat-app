import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './model/user.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createUser(@Body() user: User) {
    return await this.appService.createUser(user);
  }

  @Get()
  async listUser() {
    return await this.appService.listUser();
  }

  // @Put('/:id')
  // async updateUser(@Body() user: User) {
  //   console.log(this.appService.updateUser(user));
  // }
}
