import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserInRequest } from 'src/global-types';
import { IS_PUBLIC_KEY } from '../../decorators/public/public.decorator';
import { ACCESS_TOKEN_KEY_NAME } from './constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Allow access for public routes
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();

    // Extract the access token from the authorization header
    const authHeader = request.headers?.authorization;
    let accessToken: string | undefined;

    if (authHeader) {
      // If authorization header exists, split to get the token
      accessToken = authHeader.split(' ')?.[1];
    }

    // If no token in the authorization header, fall back to the token in cookies
    if (!accessToken) {
      accessToken = request.cookies?.[ACCESS_TOKEN_KEY_NAME];
    }

    if (!accessToken) {
      throw new UnauthorizedException('No valid authentication token found');
    }

    try {
      // Verify the token
      const payload = this.jwtService.verify<UserInRequest>(accessToken);
      request.user = { id: payload.id };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
