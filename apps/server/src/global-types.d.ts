import { Request } from 'express';

type UserInRequest = {
  id: number;
};

declare global {
  namespace Express {
    interface Request {
      user?: UserInRequest;
    }
  }
}
