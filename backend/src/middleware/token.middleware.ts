import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const header = req.headers.authorization;
      if (header) {
        const token = header.split(' ')[1];
        const result = this.jwtService.verify(token);
        if (result) {
          next();
        } else return res.send({ result: 'Unauthorized' });
      } else return res.send({ result: 'Please provide token' });
    } catch (err) {
      return err;
    }
  }
}
