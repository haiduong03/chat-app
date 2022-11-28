import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import { UserService } from 'src/service/user.service';

@Injectable()
export class Guard {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    try {
      const user = await this.userService.findUserByEmail(email);

      if (user) {
        // const payload = { id: user._id, name: user.userName };
        const compare = compareSync(
          password.toString(),
          user.password.toString(),
        );
        if (compare == true) {
          const token = this.jwtService.sign({
            id: user._id,
            name: user.name,
          });
          return { token };
        }
      }

      return { result: 'access denied' };
    } catch (err) {
      return err;
    }
  }

  // async validToken(token: string) {
  //   const result = this.jwtService.verify(token);
  //   if(result == true){

  //   }
  // }
}
