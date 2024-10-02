import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common/interfaces';
import { UserInRequest } from 'src/global-types';
import { ACCESS_TOKEN_KEY_NAME } from './constants';

const mockJwtService = {
  verify: jest.fn(),
};

const mockReflector = {
  getAllAndOverride: jest.fn<boolean, [string, any]>().mockReturnValue(false),
};

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: JwtService, useValue: mockJwtService },
        { provide: Reflector, useValue: mockReflector },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    reflector = module.get<Reflector>(Reflector);
  });

  describe('canActivate', () => {
    let context: ExecutionContext;

    beforeEach(() => {
      context = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn<
            () => {
              headers: Record<string, string>;
              cookies: Record<string, string>;
            },
            any
          >(),
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;
    });

    it('should allow access for public routes', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(true); // Simulate public route

      const result = await authGuard.canActivate(context);

      expect(result).toBe(true);
      expect(mockReflector.getAllAndOverride).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if no token is provided', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(false); // Simulate private route
      (context.switchToHttp().getRequest as any).mockReturnValue({
        headers: {},
        cookies: {},
      });

      await expect(authGuard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      const request = {
        headers: { authorization: 'Bearer invalidToken' },
        cookies: {},
      };

      (context.switchToHttp().getRequest as any).mockReturnValue(request);
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authGuard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should set the user in the request if the token is valid', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      const request = {
        headers: { authorization: 'Bearer validToken' },
        cookies: {},
        user: {},
      };
      const mockPayload = { id: 1 } as UserInRequest;

      (context.switchToHttp().getRequest as any).mockReturnValue(request);
      mockJwtService.verify.mockReturnValue(mockPayload);

      const result = await authGuard.canActivate(context);

      expect(result).toBe(true);
      expect(request.user).toEqual({ id: mockPayload.id });
      expect(mockJwtService.verify).toHaveBeenCalledWith('validToken');
    });

    it('should fallback to cookies if no authorization header is present', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      const request = {
        headers: {},
        cookies: { [ACCESS_TOKEN_KEY_NAME]: 'validToken' },
        user: {},
      };

      (context.switchToHttp().getRequest as any).mockReturnValue(request);
      const mockPayload = { id: 1 } as UserInRequest;
      mockJwtService.verify.mockReturnValue(mockPayload);

      const result = await authGuard.canActivate(context);

      expect(result).toBe(true);
      expect(request.user).toEqual({ id: mockPayload.id });
      expect(mockJwtService.verify).toHaveBeenCalledWith('validToken');
    });
  });
});
