import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import { UserService } from 'src/service/user.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class Guard implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  use(req: any, res: any, next: (error?: any) => void) {
    throw new Error('Method not implemented.');
  }

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

      return { result: 'Please try again !!' };
    } catch (err) {
      return err;
    }
  }

  async validToken(req: Request, res: Response, next: NextFunction) {
    try {
      const header = req.headers.authorization;
      const token = header.split(' ')[1];

      const result = await this.jwtService.verify(token);
      if (result == true) {
        next();
      }
    } catch (err) {
      return err;
    }
  }
}
