import { Request } from 'express';
import { User } from 'src/modules/users/user.entity';

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

export interface RequestWithUser extends Request {
  user: User;
}
